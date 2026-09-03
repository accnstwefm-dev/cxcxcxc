import { NextResponse } from "next/server";
import { generateCaptcha } from "@/lib/captcha";
import { createToken } from "@/lib/token";

const config = require("@/config");

export const dynamic = "force-dynamic";

export async function GET() {
  const { answer, svg } = generateCaptcha(config.captcha.length);
  const token = createToken(answer);

  // Return both the image (as a data URI) and the encrypted token.
  // The token travels in the form body on submit — no cookies involved.
  const base64 = Buffer.from(svg).toString("base64");

  return NextResponse.json({
    image: `data:image/svg+xml;base64,${base64}`,
    token,
  });
}
