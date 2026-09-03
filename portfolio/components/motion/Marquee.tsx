"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Marquee - infinite horizontal scroll. Duplicates the children once for a
 * seamless loop. Speed is in pixels-per-second.
 *
 * NOTE: phase 4 motion forensics needs to confirm framer's exact marquee speed
 * and easing if the mirror uses one. Default of 60px/s is a placeholder.
 */
export function Marquee({
  children,
  speed = 60,
  direction = "left",
  pauseOnHover = false,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const track = trackRef.current;
      if (!track) return;
      const distance = track.scrollWidth / 2;
      if (distance === 0) return;
      const duration = distance / speed;
      const tween = gsap.to(track, {
        x: direction === "left" ? -distance : distance,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((value: string) => {
            const numeric = parseFloat(value);
            return numeric % distance;
          }),
        },
      });
      return () => {
        tween.kill();
      };
    },
    { scope: containerRef, dependencies: [speed, direction] },
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", pauseOnHover && "[&:hover_*]:[animation-play-state:paused]", className)}
    >
      <div ref={trackRef} className="inline-flex shrink-0 whitespace-nowrap">
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
