"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { registerGsap, yuyaMotion } from "@/lib/motion";
import { useLoaderReady } from "@/lib/loader-state";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  children: ReactNode;
  /** delay before this line reveals (seconds) */
  delay?: number;
  /** duration of the reveal (seconds) - defaults to yuya primary 1.2s */
  duration?: number;
  /** custom ease - defaults to yuyaPrimary */
  ease?: string;
  className?: string;
};

/**
 * MaskedLine - gsap masked-lines reveal for a single line of text.
 *
 * Wraps the child in an `overflow:hidden` mask. The inner element starts at
 * `yPercent: 100` (below the mask) + `opacity: 0`, then animates up into view.
 * Result: the line appears to "rise from behind a curtain."
 *
 * Use this for hero titles where each line is its own element (e.g.
 * "STEPHEN" and "HUNG" as separate h1s). For multi-line paragraphs that
 * wrap dynamically, use SplitText instead.
 */
export function MaskedLine({
  children,
  delay = 0,
  duration = yuyaMotion.durations.primary,
  ease = yuyaMotion.eases.primary,
  className,
}: Props) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const loaderReady = useLoaderReady();
  const reducedMotion = useReducedMotion();

  // set initial hidden state immediately so the masked text isn't visible
  useEffect(() => {
    registerGsap();
    const node = innerRef.current;
    if (!node) return;
    if (reducedMotion) {
      gsap.set(node, { clearProps: "all" });
      return;
    }
    gsap.set(node, { yPercent: 100, opacity: 0 });
  }, [reducedMotion]);

  // play the rise once the loader has handed off
  useEffect(() => {
    if (!loaderReady) return;
    registerGsap();
    const node = innerRef.current;
    if (!node) return;
    if (reducedMotion) {
      gsap.set(node, { clearProps: "all" });
      return;
    }
    const tween = gsap.to(node, {
      yPercent: 0,
      opacity: 1,
      duration,
      delay,
      ease,
    });
    return () => {
      tween.kill();
    };
  }, [loaderReady, delay, duration, ease, reducedMotion]);

  return (
    <span className={cn("block overflow-hidden", className)}>
      <span ref={innerRef} className="block will-change-transform">
        {children}
      </span>
    </span>
  );
}
