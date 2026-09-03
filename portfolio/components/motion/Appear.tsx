"use client";

import { useEffect, useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap } from "gsap";
import { registerGsap, yuyaMotion, appearProps, type AppearVariant } from "@/lib/motion";
import { useLoaderReady } from "@/lib/loader-state";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = ComponentPropsWithoutRef<"div"> & {
  variant?: AppearVariant;
  delay?: number;
  children?: ReactNode;
};

/**
 * Appear - direct port of Framer's `<script type="framer/appear">` entrance
 * animation. Hides the element on mount with the `from` state, then animates to
 * `to` with the configured duration/ease. SSR delivers visible markup; client
 * hides + animates immediately on hydration.
 */
export function Appear({
  variant = "y175-up",
  delay = 0,
  className,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const loaderReady = useLoaderReady();
  const reducedMotion = useReducedMotion();

  // hide on mount immediately, but defer the play-tween until loader exits
  useEffect(() => {
    registerGsap();
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) {
      gsap.set(node, { clearProps: "all" });
      return;
    }
    const { from } = appearProps(variant);
    gsap.set(node, from);
  }, [variant, reducedMotion]);

  useEffect(() => {
    if (!loaderReady) return;
    registerGsap();
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) {
      gsap.set(node, { clearProps: "all" });
      return;
    }
    const { to } = appearProps(variant);
    const tween = gsap.to(node, { ...to, delay });
    return () => {
      tween.kill();
    };
  }, [loaderReady, variant, delay, reducedMotion]);

  return (
    <div ref={ref} className={cn(className)} {...rest}>
      {children}
    </div>
  );
}

/**
 * AppearGroup - coordinates a primary wave + secondary wave matching framer's
 * 0.6s stagger pattern from case-study pages.
 */
type GroupProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
  primaryVariant?: AppearVariant;
  secondaryVariant?: AppearVariant;
  className?: string;
};

export function AppearGroup({
  primary,
  secondary,
  primaryVariant = "y175-up",
  secondaryVariant = "y175-up",
  className,
}: GroupProps) {
  return (
    <div className={cn("contents", className)}>
      {primary && <Appear variant={primaryVariant}>{primary}</Appear>}
      {secondary && (
        <Appear variant={secondaryVariant} delay={yuyaMotion.delays.secondaryStagger}>
          {secondary}
        </Appear>
      )}
    </div>
  );
}
