"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Logo = {
  name: string;
  image?: string;
};

type Props = {
  logos: Logo[];
  className?: string;
  /** seconds for one full loop. default 35s */
  duration?: number;
};

/**
 * LogoMarquee. Marquee of org names rendered as a credit-roll style strip
 * (small uppercase mono, dot separators). Looks intentional as a text crawl
 * instead of pretending to be logos. Swap individual entries to real SVGs
 * later by setting `image` on a logo.
 */
export function LogoMarquee({ logos, className, duration = 35 }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        className="flex items-center w-max"
        style={{
          animation: reducedMotion ? "none" : `marquee ${duration}s linear infinite`,
        }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex items-center shrink-0"
          >
            {logo.image ? (
              <div className="px-8 tablet:px-10 h-8 tablet:h-10 flex items-center">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={160}
                  height={40}
                  className="h-full w-auto object-contain opacity-60 grayscale"
                />
              </div>
            ) : (
              <span
                className={cn(
                  "px-5 tablet:px-7 font-mono text-[12px] tablet:text-[13px]",
                  "uppercase tracking-[0.18em] text-muted-medium whitespace-nowrap",
                )}
              >
                {logo.name}
              </span>
            )}
            <span className="font-mono text-[10px] text-muted-light select-none">·</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
