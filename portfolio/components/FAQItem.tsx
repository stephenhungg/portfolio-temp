"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  question: string;
  answer: string;
};

/**
 * FAQItem - gsap-animated accordion. Click toggles open/close. Uses the
 * height: 0 → auto trick (paused timeline that we play/reverse) so the answer
 * panel slides smoothly. Plus icon rotates 45° → cross.
 */
export function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const panel = panelRef.current;
    if (!panel) return;
    const tl = gsap
      .timeline({ paused: true })
      .to(panel, {
        height: "auto",
        duration: reducedMotion ? 0 : 0.55,
        ease: "power3.out",
      })
      .to(
        panel,
        {
          opacity: 1,
          duration: reducedMotion ? 0 : 0.4,
          ease: "power2.out",
        },
        0.05,
      )
      .reverse();
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.reversed(!open);
  }, [open]);

  return (
    <div className="group border-b border-muted-light">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-sans text-[15px] tablet:text-[16px] font-medium tracking-[-0.02em]">
          {question}
        </span>
        <span
          aria-hidden
          className={cn(
            "ml-4 inline-flex items-center justify-center text-muted-medium text-[20px] leading-none w-6 h-6",
            "[transition:transform_400ms_cubic-bezier(0.42,0.21,0,1),color_300ms_ease]",
            open && "rotate-45 text-foreground",
          )}
        >
          +
        </span>
      </button>
      {/* the panel - height starts at 0, opacity 0; gsap timeline animates both */}
      <div
        ref={panelRef}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
      >
        <p className="font-sans font-normal text-[14px] tablet:text-[15px] leading-[1.5] text-muted-dark pb-6 max-w-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
}
