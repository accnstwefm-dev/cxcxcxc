"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

export default function CaptchaPage() {
  const [imageSrc, setImageSrc] = useState("");
  const [token, setToken] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadCaptcha = async () => {
    setLoading(true);
    setMessage(null);
    setAnswer("");
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);

    try {
      const res = await fetch(`/api/captcha?_=${Date.now()}`);
      const data = await res.json();
      setImageSrc(data.image);
      setToken(data.token);
    } catch {
      setMessage({ type: "error", text: "Could not load challenge. Please refresh the page." });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || submitting) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer.trim(), token }),
      });

      const data = await res.json();

      if (data.ok) {
        setMessage({ type: "success", text: "Verified. Redirecting\u2026" });
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 600);
      } else {
        setMessage({ type: "error", text: data.error });
        loadCaptcha();
      }
    } catch {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        {/* Icon */}
        <div className="icon-row">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <h1 className="title">Verify you&apos;re human</h1>
        <p className="subtitle">Enter the characters shown below to continue.</p>

        {/* CAPTCHA image */}
        <div className="captcha-area">
          {loading ? (
            <div className="skeleton" />
          ) : (
            <img src={imageSrc} alt="Verification challenge" draggable={false} />
          )}

          <button
            type="button"
            className={`refresh-btn ${spinning ? "spin" : ""}`}
            onClick={loadCaptcha}
            aria-label="Load new challenge"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="captcha-input">
            Characters
          </label>
          <input
            ref={inputRef}
            id="captcha-input"
            className="field-input"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type what you see"
            maxLength={8}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={!answer.trim() || submitting}
          >
            {submitting ? "Verifying\u2026" : "Verify"}
          </button>
        </form>

        {message && (
          <div className={`msg ${message.type}`}>{message.text}</div>
        )}

        <div className="footer">Protected by Captcha Gate</div>
      </div>
    </div>
  );
}
