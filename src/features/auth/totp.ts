import crypto from "crypto";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes a buffer into a Base32 string (RFC 4648).
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string into a Buffer.
 */
export function base32Decode(input: string): Buffer {
  const cleaned = input.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const index = BASE32_CHARS.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid Base32 character encountered: ${char}`);
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a random Base32 secret for TOTP (default 20 bytes = 160 bits).
 */
export function generateTotpSecret(byteLength = 20): string {
  const buffer = crypto.randomBytes(byteLength);
  return base32Encode(buffer);
}

/**
 * Generates a 6-digit TOTP token for a given timestamp based on RFC 6238.
 */
export function generateTotpToken(
  secret: string,
  timestampMs = Date.now(),
  stepSeconds = 30,
): string {
  const key = base32Decode(secret);
  const counter = Math.floor(timestampMs / 1000 / stepSeconds);

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verifies a 6-digit TOTP token against a secret with a window of ±1 step (±30s).
 */
export function verifyTotpCode(
  secret: string,
  token: string,
  window = 1,
  timestampMs = Date.now(),
  stepSeconds = 30,
): boolean {
  const cleanedToken = token.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanedToken)) {
    return false;
  }

  try {
    for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
      const checkTime = timestampMs + errorWindow * stepSeconds * 1000;
      const expectedToken = generateTotpToken(secret, checkTime, stepSeconds);
      if (crypto.timingSafeEqual(Buffer.from(expectedToken), Buffer.from(cleanedToken))) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Generates an otpauth:// URI compatible with Google Authenticator, Microsoft Authenticator, etc.
 */
export function generateTotpUri(
  email: string,
  secret: string,
  issuer = "Netloka",
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates 8 random 8-character backup recovery codes formatted as 'xxxx-xxxx'.
 */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString("hex"); // 8 chars
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`);
  }
  return codes;
}

/**
 * Hashes a backup recovery code using SHA-256.
 */
export function hashBackupCode(code: string): string {
  const normalized = code.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Verifies a provided backup code against a list of stored hashed codes and consumes it.
 */
export function verifyAndConsumeBackupCode(
  inputCode: string,
  storedHashedCodes: string[],
): { valid: boolean; remainingHashedCodes: string[] } {
  const hashedInput = hashBackupCode(inputCode);
  const matchIndex = storedHashedCodes.findIndex((storedHash) => storedHash === hashedInput);

  if (matchIndex === -1) {
    return { valid: false, remainingHashedCodes: storedHashedCodes };
  }

  const remaining = [...storedHashedCodes];
  remaining.splice(matchIndex, 1);
  return { valid: true, remainingHashedCodes: remaining };
}
