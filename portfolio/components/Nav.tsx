"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Appear } from "./motion/Appear";
import { registerGsap } from "@/lib/motion";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  className?: string;
};

function DotIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid grid-cols-2 gap-[3px] transition-transform duration-500 ease-[var(--ease-yuya-primary)]",
        open ? "rotate-45" : "rotate-0",
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="block w-[4px] h-[4px] rounded-full bg-current"
        />
      ))}
    </span>
  );
}

export function Nav({ className }: Props) {
  const [open, setOpen] = useState(false);
  // drawerVisible: true while drawer height > 0 (during open + close animations).
  // separates the React-instant `open` state from the animation-bound bg state,
  // so the nav bg doesn't pop to transparent before the collapse anim finishes.
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  // build the height-0-to-auto timeline once on mount
  useEffect(() => {
    registerGsap();
    const drawer = drawerRef.current;
    const links = linksRef.current;
    if (!drawer || !links) return;

    const context = gsap.context(() => {
      const duration = reducedMotion ? 0 : 0.9;
      const linkDuration = reducedMotion ? 0 : 0.7;
      const tl = gsap
      .timeline({
        paused: true,
        onStart: () => setDrawerVisible(true),
        onReverseComplete: () => setDrawerVisible(false),
      })
      .to(drawer, {
        duration,
        height: "auto",
        ease: "power4.out",
      })
      .to(
        links.querySelectorAll("li"),
        {
          duration: linkDuration,
          opacity: 1,
          y: 0,
          ease: "power3.out",
          stagger: 0.05,
        },
        0.15,
      )
      .reverse(); // start collapsed

      tlRef.current = tl;
    }, drawer);
    return () => {
      context.revert();
      tlRef.current = null;
    };
  }, [reducedMotion]);

  // toggle on open state change
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.reversed(!open);
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "absolute top-0 inset-x-0 z-30",
        // bg stays white through the entire open AND close animation;
        // only flips back to transparent once the drawer has fully collapsed
        drawerVisible ? "bg-white" : "bg-transparent",
        className,
      )}
    >
      <div className="w-full px-9 desktop:px-9">
        <nav className="flex items-center justify-between py-[18px] desktop:py-[30px]">
          <Appear variant="y-100-up">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex items-center min-h-11 font-sans font-bold text-[20px] tablet:text-[24px] desktop:text-[30px] leading-[1.1] tracking-[-0.06em]"
            >
              stpn.
            </Link>
          </Appear>
          <Appear variant="y-100-up" delay={0.08}>
            <button
              ref={buttonRef}
              type="button"
              aria-label={open ? "close menu" : "open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center text-foreground hover:text-muted-medium transition-colors"
            >
              <DotIcon open={open} />
            </button>
          </Appear>
        </nav>

        {/* drawer - height 0 → auto via gsap */}
        <div
          id="site-menu"
          ref={drawerRef}
          aria-hidden={!open}
          inert={!open}
          style={{ height: 0, overflow: "hidden" }}
        >
          <div className="border-t border-muted-light pt-10 tablet:pt-14 pb-12 tablet:pb-16">
            <ul ref={linksRef} className="flex flex-col gap-3 tablet:gap-4">
              {site.nav.map((item) => (
                <li
                  key={item.href}
                  style={{ opacity: 0, transform: "translateY(20px)" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block font-sans font-semibold leading-[0.95]",
                      "text-[44px] tablet:text-[72px] desktop:text-[96px]",
                      "tracking-[-0.06em]",
                      "transition-colors duration-300 hover:text-muted-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 tablet:mt-16 flex items-end justify-between gap-6 font-sans text-[16px] font-medium text-muted-dark">
              <div className="flex flex-col gap-1">
                <Link href={`mailto:${site.email}`} className="inline-flex items-center min-h-11 yuya-link hover:text-foreground">
                  {site.email}
                </Link>
                <span className="text-muted-medium">berkeley, ca</span>
              </div>
              <div className="flex flex-col gap-1 items-end text-right">
                <Link href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 yuya-link hover:text-foreground">linkedin →</Link>
                <Link href={site.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 yuya-link hover:text-foreground">github →</Link>
                <Link href={site.socials.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 yuya-link hover:text-foreground">x →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
