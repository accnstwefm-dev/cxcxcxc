import crypto from "crypto";
import { cookies } from "next/headers";

const config = require("@/config");

const ALGORITHM = "aes-256-gcm";
const SECRET = crypto
  .createHash("sha256")
  .update(config.secret)
  .digest();

// ── Encrypt a value into a tamper-proof token ──
export function encrypt(data: Record<string, unknown>): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
  const json = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(json, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // iv:tag:ciphertext  (all hex)
  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

// ── Decrypt and verify a token ──
export function decrypt(token: string): Record<string, unknown> | null {
  try {
    const [ivHex, tagHex, encHex] = token.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf8"));
  } catch {
    return null;
  }
}

// ── Store the CAPTCHA answer in an encrypted HTTP-only cookie ──
export function setCaptchaCookie(answer: string) {
  const data = {
    answer,
    expires: Date.now() + config.captcha.expiry * 1000,
  };
  const token = encrypt(data);
  cookies().set("__captcha", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: config.captcha.expiry,
    path: "/",
  });
}

// ── Read and validate the stored CAPTCHA answer ──
export function getCaptchaAnswer(): string | null {
  const cookie = cookies().get("__captcha");
  if (!cookie) return null;
  const data = decrypt(cookie.value);
  if (!data) return null;
  if (Date.now() > (data.expires as number)) return null;
  return data.answer as string;
}

// ── Set a "solved" session cookie ──
export function setSessionCookie() {
  const data = {
    solved: true,
    expires: Date.now() + config.captcha.sessionTTL * 1000,
  };
  const token = encrypt(data);
  cookies().set("__gate_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: config.captcha.sessionTTL,
    path: "/",
  });
}

// ── Check if the visitor has a valid solved session ──
export function hasValidSession(): boolean {
  const cookie = cookies().get("__gate_session");
  if (!cookie) return false;
  const data = decrypt(cookie.value);
  if (!data) return false;
  return data.solved === true && Date.now() < (data.expires as number);
}
