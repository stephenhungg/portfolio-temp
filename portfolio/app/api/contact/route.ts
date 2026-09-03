import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// in-memory rate limit per cold start. good enough for a portfolio contact form;
// vercel spins these down between bursts so abuse is naturally bounded
const HITS = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX = 3;
const MAX_TRACKED_IPS = 1000;
const MAX_BODY_BYTES = 12_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rateLimited(ip: string) {
  const now = Date.now();
  if (HITS.size >= MAX_TRACKED_IPS) {
    for (const [key, value] of HITS) {
      if (now > value.reset) HITS.delete(key);
    }
    if (HITS.size >= MAX_TRACKED_IPS) HITS.delete(HITS.keys().next().value ?? "");
  }
  const slot = HITS.get(ip);
  if (!slot || now > slot.reset) {
    HITS.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (slot.count >= MAX) return true;
  slot.count += 1;
  return false;
}

const TO = "stephenhung@berkeley.edu";
const FROM = "Stephen's Portfolio <contact@stephenhung.me>";

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  const origin = req.headers.get("origin");
  const allowedOrigins = new Set([
    "https://stephenhung.me",
    "https://www.stephenhung.me",
    "http://localhost:3000",
  ]);
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let payload: { name?: string; email?: string; message?: string; honeypot?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, honeypot } = payload;

  // honeypot - bots fill hidden fields, humans don't
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Try again in one minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  const cleanMessage = message?.trim();

  if (
    !cleanName ||
    !cleanEmail ||
    !cleanMessage ||
    cleanName.length > 200 ||
    cleanEmail.length > 200 ||
    cleanMessage.length > 5000
  ) {
    return NextResponse.json({ error: "Complete every field within the stated limits." }, { status: 400 });
  }

  // basic email shape check - not RFC-perfect, just enough to filter junk
  if (!EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: cleanEmail,
      subject: `Portfolio inquiry from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Send threw:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
