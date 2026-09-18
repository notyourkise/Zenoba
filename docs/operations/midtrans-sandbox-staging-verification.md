# Midtrans Dynamic QRIS Sandbox & Staging Verification Runbook

**Document version:** 1.0  
**Effective date:** 2026-09-19 WITA  
**Milestone / Sprint:** Milestone 15 / Sprint 42 / Task 42.3  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Contact Mailbox:** noreply@haikalariadma.my.id  
**Status:** VERIFIED (Sandbox & Staging Flows)  
**Production Live-Payment Gate:** STRICTLY GATED (Awaiting separate owner authorization in Task 42.4)

---

## 1. Overview & Verification Objective

This document establishes the verified operational evidence for Midtrans Core API Dynamic QRIS payment processing across Netloka's course commerce system. All real-world commercial lifecycles were validated through automated integration suites and staging execution guidelines to ensure:

1. **Deterministic State Transitions:** Orders only transition through valid state machine paths (`PENDING` -> `PAID`, `EXPIRED`, or `CANCELLED`).
2. **Server-Authoritative Access Guard:** Client browser redirects alone never grant course access; entitlements require cryptographically verified provider webhook notifications.
3. **Cryptographic Integrity:** Webhook notifications require valid SHA-512 signatures matched using timing-safe byte comparison (`crypto.timingSafeEqual`). Tampered notifications are rejected with HTTP 401 and logged to the security audit ledger.
4. **Idempotency & Replay Resistance:** Replayed notifications (`providerEventId = "${transaction_id}_${transaction_status}"`) return HTTP 200 `{ status: "already_processed" }` without state mutation or duplicate entitlement grants.
5. **Operator Reconciliation:** Dropped webhooks or network delays can be inspected in dry-run mode and repaired with an audited justification via the VPS CLI (`scripts/reconcile-midtrans.ts`).
6. **Consumer Protection & Dispute SOP:** Refund and dispute workflows adhere to Indonesian consumer protection standards (UU Perlindungan Konsumen & UU PDP), with immediate revocation capabilities.

---

## 2. End-to-End Verification Matrix

| # | Lifecycle Scenario | Input / Action | Expected Result | Verified State | Audit / Security Evidence |
|---|---|---|---|---|---|
| **1** | **Dynamic QRIS Charge Creation** | `createCheckout({ orderReference, totalAmountIdr: 150000 })` | Endpoint `POST /v2/charge`, QR string returned, 15-min countdown set | Passed | `providerReference` stored in attempt; order stays `PENDING` |
| **2** | **Browser Redirect Decoupling** | User visits `/orders/[reference]` or `/continue` without webhook | `resolveCourseAccess` returns `DENIED` | Passed | Zero database mutations; access strictly blocked |
| **3** | **Successful Settlement** | Webhook with `transaction_status: "settlement"` and valid SHA-512 signature | Order transitions to `PAID`; lifetime entitlements granted for all bundle courses | Passed | `PaymentEvent` created (`SUCCESS`); `PaymentAttempt.state = "SUCCESS"` |
| **4** | **Payment Denial / Failure** | Webhook with `transaction_status: "deny"` or `"cancel"` | Order transitions to `CANCELLED`; 0 entitlements granted | Passed | `PaymentEvent` created (`FAILED`); `PaymentAttempt.state = "FAILED"` |
| **5** | **QRIS Expiration Window** | Webhook with `transaction_status: "expire"` (after 15 minutes) | Order transitions to `EXPIRED`; 0 entitlements granted | Passed | `PaymentEvent` created (`EXPIRED`); `PaymentAttempt.state = "EXPIRED"` |
| **6** | **Idempotent Webhook Replay** | Re-delivering notification with identical `providerEventId` | HTTP 200 `{ status: "already_processed" }`; 0 duplicate grants | Passed | Duplicate event deduplicated; order remains `PAID` |
| **7** | **Signature Tampering Defense** | Webhook payload with altered amount, order ID, or forged signature | HTTP 401 Unauthorized `{ error: "Unauthorized: invalid signature" }` | Passed | `COMMERCE_WEBHOOK_INVALID_SIGNATURE` logged with sanitized metadata |
| **8** | **Out-of-Order Delivery** | Settlement notification arrives for an already `PAID` or `EXPIRED` order | Returns `processed: false`; order state does not regress | Passed | Final order states (`PAID`, `EXPIRED`, `CANCELLED`) remain immutable |
| **9** | **CLI Status Reconciliation** | Webhook lost; operator runs `scripts/reconcile-midtrans.ts <ref>` | Dry-run reports discrepancy; repair mode with `--reason` synchronizes state | Passed | `COMMERCE_RECONCILIATION_REPAIR` logged with operator justification |
| **10** | **Refund Entitlement Revocation** | Operator processes refund in Midtrans portal; sets `Entitlement.state = "REVOKED"` | `resolveCourseAccess` immediately returns `DENIED` | Passed | Entitlement state updated to `REVOKED`; learner access severed |

---

## 3. Cryptographic Signature Verification Details

Midtrans calculates signatures using:

$$\text{signature\_key} = \text{SHA-512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$

Verification implementation in `src/features/commerce/payments/midtrans-gateway.ts`:

```ts
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  providedSignature: string,
): boolean {
  if (!orderId || !statusCode || !grossAmount || !serverKey || !providedSignature) {
    return false;
  }

  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedSignature = crypto.createHash("sha512").update(payload).digest("hex");

  const computedBuffer = Buffer.from(computedSignature, "utf-8");
  const providedBuffer = Buffer.from(providedSignature, "utf-8");

  if (computedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedBuffer, providedBuffer);
}
```

### Security Incident Handling for Tampered Signatures

When an invalid signature is received by `POST /api/commerce/webhooks/midtrans`:
1. The request is immediately rejected with HTTP 401.
2. A security event is asynchronously persisted to the `SecurityEvent` table:
   - `type: "COMMERCE_WEBHOOK_INVALID_SIGNATURE"`
   - `severity: "HIGH"`
   - `metadata`: Contains error details and request headers (with all tokens/passwords automatically redacted by `sanitizeMetadata`).
   - The raw `MIDTRANS_SERVER_KEY` is never included in logs or database records.

---

## 4. Operator Reconciliation Protocol (VPS CLI)

When network interruptions prevent Midtrans webhooks from reaching Netloka, the order remains in `PENDING` status. Operators can safely diagnose and repair using `scripts/reconcile-midtrans.ts`:

### Dry-Run Inspection (Read-Only)

```bash
npx tsx scripts/reconcile-midtrans.ts ORD-20260918-XXXXXX
```

**Example Output:**
```text
=======================================================
Midtrans Reconciliation Tool
Mode: DRY-RUN (Read-only inspection)
Target: ORD-20260918-XXXXXX
=======================================================
Order Reference:          ORD-20260918-XXXXXX
Local Order State:        PENDING
Remote Midtrans Status:   settlement
Remote Gross Amount:      150000.00
Remote Transaction ID:    9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
Action Needed:            YES
Action Taken:             REPAIR_REQUIRED
Details:                  Order state PENDING does not match remote status settlement (expected PAID). Run with --repair --reason='...' to synchronize.
=======================================================
```

### Mutating Repair Execution

Repair mode strictly requires the `--repair` flag and an explicit justification reason (`--reason`, minimum 10 characters):

```bash
npx tsx scripts/reconcile-midtrans.ts ORD-20260918-XXXXXX --repair --reason="Manual reconciliation after confirmed customer payment in Midtrans portal"
```

**Result:**
- Order state transitions to `PAID`.
- Course entitlements are upserted to `ACTIVE`.
- A security audit event is created: `COMMERCE_RECONCILIATION_REPAIR` with severity `WARN`, storing the operator justification and remote transaction ID.

---

## 5. Staging Environment Rehearsal Guide

To exercise the sandbox integration on an isolated staging server:

1. **Verify Environment Configuration:**
   ```bash
   cat /srv/netloka/staging/.env | grep -E "PAYMENT_MODE|MIDTRANS"
   ```
   Ensure:
   - `PAYMENT_MODE="sandbox"`
   - `MIDTRANS_SERVER_KEY="SB-Mid-server-..."`
   - `MIDTRANS_IS_PRODUCTION="false"`

2. **Generate Sandbox QRIS Charge:**
   - Log in to Netloka staging as a test learner.
   - Navigate to `/catalog` and select a test course package.
   - Initiate checkout to receive the Dynamic QRIS code.
   - Note the order reference (e.g. `ORD-STAGING-001`).

3. **Simulate Payment via Midtrans Simulator:**
   - Open [Midtrans QRIS Simulator](https://simulator.sandbox.midtrans.com/qris/index).
   - Enter the `qr_string` or scan the rendered QR code.
   - Click **Pay** to simulate settlement.

4. **Verify Immediate Entitlement Activation:**
   - Observe the Netloka learner interface updating to `PAID`.
   - Verify course access is immediately unlocked in `/my-learning`.

5. **Simulate Expiry & Failure:**
   - Repeat checkout and allow 15 minutes to elapse or trigger an `expire` event in the Midtrans Sandbox Simulator.
   - Confirm order status displays `EXPIRED` and no course access is granted.

---

## 6. Commercial Gate Notice

> [!CAUTION]
> **Production Live-Payment Gate Status: LOCKED**  
> All work in Task 42.1, 42.2, and 42.3 has been executed and verified strictly within the Midtrans Sandbox environment.  
> Enabling live production credentials (`MIDTRANS_IS_PRODUCTION="true"`, `PAYMENT_MODE="live"`) and accepting real monetary payments requires separate explicit owner authorization in **Task 42.4**.
