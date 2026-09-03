"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  className?: string;
  /** size variant: lg = 22-26px (home/contact email), sm = 16px (footer) */
  size?: "lg" | "sm";
};

/**
 * CopyEmail - yuya pattern: email link + small copy-to-clipboard icon button.
 * Click the email → opens mailto. Click the icon → copies to clipboard, shows
 * "Copied!" feedback for 1.6s, then reverts.
 */
export function CopyEmail({ email, className, size = "lg" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked - fail silently */
    }
  };

  const textCls =
    size === "lg"
      ? "text-[22px] tablet:text-[26px] font-medium tracking-[-0.06em] leading-[1.3]"
      : "text-[16px] font-medium";
  const iconSize = size === "lg" ? 16 : 14;

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-3",
        // unified color transition - both email + icon shift to muted on hover anywhere
        "[transition:color_400ms_cubic-bezier(0.44,0,0.56,1)]",
        "hover:text-muted-medium",
        className,
      )}
    >
      <Link
        href={`mailto:${email}`}
        className={cn("font-sans relative", textCls)}
        aria-label={`Email ${email}`}
      >
        <span className="relative">
          {email}
          {/* underline wipe - animates in from left on hover */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 right-0 bottom-[2px] h-[1.5px] bg-current",
              "origin-left scale-x-0 group-hover:scale-x-100",
              "[transition:transform_500ms_cubic-bezier(0.42,0.21,0,1)]",
            )}
          />
        </span>
      </Link>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy email to clipboard"}
        className={cn(
          "inline-flex items-center justify-center relative",
          // slight scale up on group-hover so icon feels alive
          "[transition:transform_400ms_cubic-bezier(0.42,0.21,0,1)]",
          "group-hover:scale-110",
        )}
        style={{ width: Math.max(44, iconSize + 8), height: Math.max(44, iconSize + 8) }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn(
            "transition-opacity duration-200",
            copied ? "opacity-0" : "opacity-100",
          )}
        >
          <rect x="5" y="5" width="9" height="9" rx="1.2" />
          <path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
        </svg>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn(
            "absolute inset-0 m-auto transition-opacity duration-200",
            copied ? "opacity-100" : "opacity-0",
          )}
        >
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </span>
  );
}
