"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Body, Caption, Eyebrow } from "./typography";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot - never bound to a visible input. bots fill it; humans don't.
  const [honeypot, setHoneypot] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") resultRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Complete your name, email, and message, then try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "The message could not be sent. Try again or email me directly.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrorMsg("The network request failed. Try again or email me directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-muted-light p-8 text-center">
        <Eyebrow className="text-muted-medium font-mono uppercase tracking-[0.05em]">Sent</Eyebrow>
        <Body className="mt-3">
          Got it - I&rsquo;ll reply within 48h. If you don&rsquo;t hear back, email{" "}
          <a href={`mailto:${site.email}`} className="underline hover:text-muted-medium">
            {site.email}
          </a>
          .
        </Body>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {/* honeypot - visually hidden but bots will autofill it */}
      <label className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
        Leave blank
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </label>

      <label className="flex flex-col gap-2">
        <Caption className="text-muted-medium uppercase tracking-[0.05em] font-mono text-[11px]">
          Name
        </Caption>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={200}
          autoComplete="name"
          disabled={sending}
          className="bg-transparent border-b border-muted-light py-2 font-sans text-[16px] focus:border-foreground transition-colors disabled:opacity-50"
          placeholder="your name…"
        />
      </label>

      <label className="flex flex-col gap-2">
        <Caption className="text-muted-medium uppercase tracking-[0.05em] font-mono text-[11px]">
          Email
        </Caption>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
          autoComplete="email"
          spellCheck={false}
          disabled={sending}
          className="bg-transparent border-b border-muted-light py-2 font-sans text-[16px] focus:border-foreground transition-colors disabled:opacity-50"
          placeholder="you@example.com…"
        />
      </label>

      <label className="flex flex-col gap-2">
        <Caption className="text-muted-medium uppercase tracking-[0.05em] font-mono text-[11px]">
          Message
        </Caption>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={5000}
          rows={6}
          disabled={sending}
          className="bg-transparent border-b border-muted-light py-2 font-sans text-[16px] focus:border-foreground transition-colors resize-y disabled:opacity-50"
          placeholder="what are you building?…"
        />
      </label>

      {status === "error" && errorMsg ? (
        <Caption role="alert" className="text-error font-mono">{errorMsg}</Caption>
      ) : null}

      {sending ? (
        <span className="sr-only" role="status">sending your message…</span>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="self-start mt-2 px-6 py-3 border border-foreground font-mono text-[14px] hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 min-h-11"
      >
        {sending ? "sending…" : "send →"}
      </button>
    </form>
  );
}
