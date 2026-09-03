import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";

const config = require("@/config");

export async function POST(req: NextRequest) {
  try {
    const { answer, token } = await req.json();
    const userAnswer = (answer || "").trim();

    if (!token || !userAnswer) {
      return NextResponse.json(
        { ok: false, error: "Please enter the characters shown." },
        { status: 400 }
      );
    }

    const correctAnswer = verifyToken(token);

    if (!correctAnswer) {
      return NextResponse.json(
        { ok: false, error: "Challenge expired. A new one has been loaded." },
        { status: 400 }
      );
    }

    const match = config.captcha.caseSensitive
      ? userAnswer === correctAnswer
      : userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    if (!match) {
      return NextResponse.json(
        { ok: false, error: "That doesn't match. Please try again." },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, redirect: config.targetUrl });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 400 }
    );
  }
}
