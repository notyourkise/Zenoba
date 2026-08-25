import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hashes a plaintext password using PBKDF2 with a random salt.
 * Output format: iterations:saltHex:hashHex
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  const salt = randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2Async(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );

  return `${ITERATIONS}:${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored hash string.
 * Returns true if valid, false otherwise (timing-safe).
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!password || !storedHash || typeof password !== "string" || typeof storedHash !== "string") {
    return false;
  }

  const parts = storedHash.split(":");
  if (parts.length !== 3) {
    return false;
  }

  const [iterationsStr, salt, originalHash] = parts;
  const iterations = parseInt(iterationsStr, 10);

  if (isNaN(iterations) || !salt || !originalHash) {
    return false;
  }

  try {
    const derivedKey = await pbkdf2Async(
      password,
      salt,
      iterations,
      KEY_LENGTH,
      DIGEST
    );

    const derivedBuffer = derivedKey;
    const originalBuffer = Buffer.from(originalHash, "hex");

    if (derivedBuffer.length !== originalBuffer.length) {
      return false;
    }

    return timingSafeEqual(derivedBuffer, originalBuffer);
  } catch {
    return false;
  }
}
