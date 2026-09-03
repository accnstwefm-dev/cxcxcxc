import crypto from "crypto";

const config = require("@/config");

const ALGORITHM = "aes-256-gcm";
const KEY = crypto.createHash("sha256").update(config.secret).digest();

/** Encrypt a CAPTCHA answer + expiry into an opaque token. */
export function createToken(answer: string): string {
  const iv = crypto.randomBytes(12);
  const payload = JSON.stringify({
    a: answer,
    exp: Date.now() + config.captcha.expiry * 1000,
  });
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const enc = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(".");
}

/** Decrypt and validate a token. Returns the answer or null if expired/tampered. */
export function verifyToken(token: string): string | null {
  try {
    const [ivHex, tagHex, encHex] = token.split(".");
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(encHex, "hex")),
      decipher.final(),
    ]);
    const { a, exp } = JSON.parse(dec.toString("utf8"));
    if (Date.now() > exp) return null;
    return a as string;
  } catch {
    return null;
  }
}
