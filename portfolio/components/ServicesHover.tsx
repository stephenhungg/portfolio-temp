"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Service = {
  label: string;
  image?: string;
};

type Props = {
  services: Service[];
  className?: string;
};

/**
 * ServicesHover - yuya about-page services interaction.
 *
 * Each li wraps its own absolute image card (centered on the li, large enough
 * to spill over neighbors). The original li text label sits ABOVE the image
 * via z-index so it stays in its natural list position but pops onto the image
 * when active. Other lis dim to gray and sit behind the active li's card.
 */
export function ServicesHover({ services, className }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn("relative", className)}
      onMouseLeave={() => setHovered(null)}
    >
      <ul className="relative flex flex-col items-center gap-1 tablet:gap-2 text-center">
        {services.map((s, i) => {
          const active = hovered === i;
          const dimmed = hovered !== null && !active;
          // alternate tilt direction per card so the gallery feels organic
          const tiltDeg = i % 2 === 0 ? -4 : 4;
          const initialTilt = i % 2 === 0 ? 3 : -3;
          return (
            <li
              key={s.label}
              className={cn(
                "relative",
                // active li lifts above other lis (must beat their z-10 text spans)
                active && "z-20",
              )}
            >
              <button
                type="button"
                aria-pressed={active}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onClick={() => setHovered(active ? null : i)}
                className="relative font-sans font-bold uppercase leading-[1.0] tracking-[-0.08em] text-[44px] tablet:text-[68px] desktop:text-[90px]"
              >
                {/* image card behind the label - centered on this li, spills over neighbors */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2",
                    "block w-[280px] tablet:w-[420px] desktop:w-[480px]",
                    "aspect-[4/5] overflow-hidden bg-muted-light",
                    "z-0",
                    "[transition:opacity_180ms_ease-out,transform_400ms_cubic-bezier(0.34,1.4,0.64,1)]",
                  )}
                  style={{
                    transform: active
                      ? `translate(-50%, -50%) rotate(${tiltDeg}deg)`
                      : `translate(-50%, calc(-50% - 30px)) rotate(${initialTilt}deg)`,
                    opacity: active ? 1 : 0,
                  }}
                >
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 810px) 280px, (max-width: 1200px) 420px, 480px"
                      className="object-cover"
                    />
                  ) : null}
                </span>

                <span
                  className={cn(
                    "relative z-10",
                    "[transition:color_400ms_cubic-bezier(0.42,0.21,0,1)]",
                    dimmed ? "text-muted-medium" : "text-foreground",
                  )}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
