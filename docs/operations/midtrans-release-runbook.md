# Midtrans Dynamic QRIS Provider Boundary & Operational Runbook

**Document version:** 1.0  
**Effective date:** 2026-09-18 WITA  
**Milestone / Sprint:** Milestone 15 / Sprint 42 / Task 42.1  
**Provider:** Midtrans Core API (Dynamic QRIS)  
**Acquirer:** GoPay (`qris.acquirer: "gopay"`)  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Contact / Mailbox:** noreply@haikalariadma.my.id  
**Production Activation Gate:** STRICTLY GATED (Requires separate explicit owner authorization in Task 42.4)

---

## 1. Provider Boundary & Architecture

Netloka integrates with Midtrans via the Core API Dynamic QRIS payment method to provide real-time, scan-and-pay transactions across Indonesian digital banking and e-wallet applications (GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin', etc.).

Strict architectural boundaries:

1. **Server-Side Only Integration:** All Midtrans Core API requests (`/v2/charge`, `/v2/{order_id}/status`) are initiated solely by the Next.js server backend. The `MIDTRANS_SERVER_KEY` is never transmitted to client browsers, embedded in static builds, or committed to Git.
2. **Authoritative Server Pricing:** `gross_amount` is determined strictly from the database `Order.totalAmountIdr`. Client-provided prices are never accepted.
3. **Idempotent Webhook Authority:** Entitlements and order state transitions occur authoritatively through verified provider webhook notifications, never through client-side return redirects.
4. **Environment Segregation:**
   - **Sandbox:** `https://api.sandbox.midtrans.com/v2` (used during development, staging, and automated integration drills).
   - **Production:** `https://api.midtrans.com/v2` (activated only after Task 42.4 explicit authorization).

---

## 2. Dynamic QRIS Charge Contract

### Charge Request (`POST /v2/charge`)

**Headers:**
```http
Accept: application/json
Content-Type: application/json
Authorization: Basic <base64(MIDTRANS_SERVER_KEY + ":")>
```

**Payload Specification:**
```json
{
  "payment_type": "qris",
  "transaction_details": {
    "order_id": "ORD-20260918-XXXXXX",
    "gross_amount": 150000
  },
  "qris": {
    "acquirer": "gopay"
  },
  "item_details": [
    {
      "id": "pkg-switching-routing-bundle",
      "price": 150000,
      "quantity": 1,
      "name": "Switching & Routing Practice Bundle"
    }
  ],
  "customer_details": {
    "first_name": "Learner Name",
    "email": "learner@example.com"
  },
  "custom_expiry": {
    "expiry_duration": 15,
    "unit": "minute"
  }
}
```

### Charge Response Contract

When Midtrans accepts the transaction, it returns HTTP 201:

```json
{
  "status_code": "201",
  "status_message": "Success, QRIS transaction is created",
  "transaction_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "order_id": "ORD-20260918-XXXXXX",
  "merchant_id": "G123456789",
  "gross_amount": "150000.00",
  "currency": "IDR",
  "payment_type": "qris",
  "transaction_time": "2026-09-18 16:30:00",
  "transaction_status": "pending",
  "fraud_status": "accept",
  "acquirer": "gopay",
  "qr_string": "00020101021226590014ID.LINKAJA.WWW0118936009110021008544...",
  "actions": [
    {
      "name": "generate-qr-code",
      "method": "GET",
      "url": "https://api.sandbox.midtrans.com/v2/qris/9b1deb4d-.../qr-code"
    }
  ]
}
```

**Normalization:**
- `qr_string`: Stored and rendered via high-contrast SVG/canvas QR code directly in the learner modal.
- `transaction_id`: Recorded as `providerReference` in `PaymentAttempt`.
- `checkoutUrl`: Fallback URL pointing to Netloka's payment status tracking page `/orders/[reference]`.

---

## 3. Webhook Notification & Cryptographic Signature Verification

### Notification Payload

Midtrans posts HTTP POST notifications to `/api/commerce/webhooks/midtrans`:

```json
{
  "transaction_time": "2026-09-18 16:32:15",
  "transaction_status": "settlement",
  "transaction_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "c055743b22cf90c4...",
  "payment_type": "qris",
  "order_id": "ORD-20260918-XXXXXX",
  "merchant_id": "G123456789",
  "gross_amount": "150000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

### Signature Verification Algorithm

The signature must be calculated and matched using Node.js `crypto`:

$$\text{signature\_key} = \text{SHA-512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$

```ts
import crypto from "crypto";

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  providedSignature: string
): boolean {
  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedHash = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(computedHash, "utf-8"),
    Buffer.from(providedSignature, "utf-8")
  );
}
```

If the signature does not match, the request is rejected immediately with HTTP 401 without updating any database records.

---

## 4. Status Mapping and Order State Transitions

| Midtrans `transaction_status` | `fraud_status` | Normalized Status | Netloka `Order` Transition | Entitlements Action |
| --- | --- | --- | --- | --- |
| `settlement` | any | `SUCCESS` | `PENDING` $\rightarrow$ `PAID` | Active lifetime access granted to all courses in package. |
| `capture` | `accept` | `SUCCESS` | `PENDING` $\rightarrow$ `PAID` | Active lifetime access granted. |
| `pending` | any | ignored | Remains `PENDING` | None (awaiting settlement). |
| `expire` | any | `EXPIRED` | `PENDING` $\rightarrow$ `EXPIRED` | None (order closed without access). |
| `cancel`, `deny` | any | `FAILED` | `PENDING` $\rightarrow$ `CANCELLED` | None. |

### Idempotency Enforcement

- Every processed event creates an entry in `PaymentEvent` where `providerEventId = "${transaction_id}_${transaction_status}"`.
- If an incoming event with the same `providerEventId` already exists, Netloka returns HTTP 200 `{ "status": "already_processed" }` immediately without duplicating database operations or entitlements.

---

## 5. Expiry, Reconciliation, and Outage Handling

1. **Expiry Window:** Dynamic QRIS codes expire after 15 minutes. The learner UI displays a live countdown timer. Once expired, the user is offered a "Generate New QR Code" action (which creates a new payment attempt).
2. **Reconciliation Protocol (`GET /v2/{order_id}/status`):**
   - If a webhook fails to deliver due to network interruption, an administrative reconciliation script or cron queries Midtrans status directly.
   - The response status is processed through the standard `recordVerifiedPaymentEvent` pipeline.
3. **Provider Outage Defense:**
   - If Midtrans returns HTTP 5xx or times out during checkout generation, Netloka returns a graceful error to the user without charging.
   - Core learning activities (free courses, completed modules, practice labs) continue functioning without interruption because commerce is strictly decoupled.

---

## 6. Security, Configuration, and Secret Rotation

### Required Environment Variables

```bash
# Midtrans Credentials
MIDTRANS_SERVER_KEY="SB-Mid-server-XXXXXXXXXXXXXXXXXXXXXXXX"
MIDTRANS_CLIENT_KEY="SB-Mid-client-XXXXXXXXXXXXXXXXXXXXXXXX"
MIDTRANS_MERCHANT_ID="GXXXXXXXXX"
MIDTRANS_IS_PRODUCTION="false"
PAYMENT_MODE="sandbox"  # 'disabled' in staging until drill; 'sandbox' during test; 'live' in prod
```

### Secret Rotation Checklist (SEV-1 Compromise)

1. Log in to Midtrans Merchant Portal: **Settings $\rightarrow$ Access Keys**.
2. Click **Change Server Key**.
3. Update `MIDTRANS_SERVER_KEY` in `/srv/netloka/staging/.env` (or production `.env`).
4. Recreate application container: `docker compose up -d --build app`.
5. Test a dummy sandbox charge to confirm key validity.
6. Verify no unauthorized transactions occurred in the portal audit log.

---

## 7. Customer Support, Refund, and Dispute Policy

- **Customer Support Mailbox:** `noreply@haikalariadma.my.id`
- **Refund Policy:** Digital learning course access is non-refundable once unlocked and accessed, in accordance with applicable consumer protection regulations (UU Perlindungan Konsumen). If an accidental double charge occurs due to network latency, Netloka will investigate and issue a refund via the Midtrans portal within 14 business days.
