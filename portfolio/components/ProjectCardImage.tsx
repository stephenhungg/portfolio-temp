import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** sizes hint for responsive image generation */
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** aspect ratio token */
  aspect?: "square" | "card" | "video";
  /** title shown on hover (yuya pattern: text fades in on top of image) */
  title?: string;
};

const aspectClasses: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  card: "aspect-[4/3]",
  video: "aspect-video",
};

/**
 * Project card image with yuya-match hover (smooth in AND out):
 *  - image scales 1 → 1.08 over 700ms
 *  - bottom gradient fades 0 → 1 over 500ms
 *  - title slides up + fades in over 500ms
 *
 * All transitions explicit so they reverse smoothly. Use within a parent
 * with the `group` class to trigger group-hover.
 */
export function ProjectCardImage({
  src,
  alt,
  sizes = "(max-width: 810px) 100vw, 50vw",
  className,
  priority = false,
  aspect = "square",
  title,
}: Props) {
  // shared yuya-primary easing for in/out symmetry
  const easeImg = "[transition:scale_700ms_cubic-bezier(0.42,0.21,0,1)]";
  const easeOverlay =
    "[transition:opacity_500ms_cubic-bezier(0.42,0.21,0,1)]";
  const easeTitle =
    "[transition:opacity_500ms_cubic-bezier(0.42,0.21,0,1),translate_500ms_cubic-bezier(0.42,0.21,0,1)]";

  return (
    <div
      className={cn(
        aspectClasses[aspect],
        "bg-muted-light overflow-hidden relative isolate",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // explicit scale-100 base so transition out interpolates smoothly
        // (going from "none" to a number can snap)
        className={cn(
          "object-cover will-change-transform scale-100",
          easeImg,
          "group-hover:scale-[1.08]",
        )}
      />

      {/* gradient scrim - fades in on hover for title contrast */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-10 pointer-events-none",
          "bg-gradient-to-t from-black/55 via-black/15 to-transparent",
          "opacity-0 group-hover:opacity-100",
          easeOverlay,
        )}
      />

      {/* title overlay - slides + fades in from below on hover */}
      {title && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-20",
            "px-6 tablet:px-8 py-6 tablet:py-7",
            // explicit translate-y-0 base so out transition reverses cleanly
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            easeTitle,
          )}
        >
          <span className="text-white font-sans font-medium text-[36px] tablet:text-[48px] tracking-[-0.04em] leading-[1.1]">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
