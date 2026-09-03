"use client";

import { useEffect, useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap } from "gsap";
import { registerGsap, yuyaMotion, appearProps, type AppearVariant } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = ComponentPropsWithoutRef<"div"> & {
  variant?: AppearVariant;
  /** rootMargin-equivalent - element is "in view" when this much of viewport height passes its top */
  threshold?: number;
  once?: boolean;
  children?: ReactNode;
};

/**
 * ScrollReveal - fires the yuya appear animation when the element enters view.
 *
 * Uses IntersectionObserver instead of ScrollTrigger because:
 *   1. SSR-safe: the element renders normally, then we hide and animate on mount
 *   2. doesn't need a real scroll event to fire (works in playwright fullPage capture)
 *   3. simpler lifecycle than ScrollTrigger.refresh on layout/image-load
 *
 * gsap is still used for the actual animation so we keep the yuya easing curves.
 */
export function ScrollReveal({
  variant = "y175-up",
  threshold = 0.15,
  once = true,
  className,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) {
      gsap.set(node, { clearProps: "all" });
      return;
    }
    const { from, to } = appearProps(variant);

    // hide initially (only on the client - SSR delivers visible markup)
    gsap.set(node, from);

    let tween: gsap.core.Tween | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            tween = gsap.to(node, to);
            if (once) observer.disconnect();
          } else if (!entry.isIntersecting && !once && playedRef.current) {
            playedRef.current = false;
            gsap.to(node, from);
          }
        }
      },
      { threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [variant, threshold, once, reducedMotion]);

  return (
    <div ref={ref} className={cn(className)} {...rest}>
      {children}
    </div>
  );
}

export { yuyaMotion };
