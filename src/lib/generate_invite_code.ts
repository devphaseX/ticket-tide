import crypto from "crypto";

export function generateInviteCode(length = 8) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // Use crypto for more cryptographically secure randomness
  const randomBytes = crypto.randomBytes(length);

  return Array.from(
    randomBytes,
    (byte) => alphabet[byte % alphabet.length],
  ).join("");
}
