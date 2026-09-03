"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** image source - optional. omit if the card is text-only and overlay handles content */
  imageSrc?: string;
  altText?: string;
  /** small tooltip caption that follows the cursor */
  captionText?: string;
  /** card outer bounds */
  containerHeight?: string;
  containerWidth?: string;
  /** scale on hover */
  scaleOnHover?: number;
  /** how much the card tilts at the edges (degrees) */
  rotateAmplitude?: number;
  /** show floating tooltip near the cursor */
  showTooltip?: boolean;
  /** content rendered above the image with a slight z-translate (overlay text/buttons) */
  overlayContent?: ReactNode;
  displayOverlayContent?: boolean;
  /** wrapper className for outer figure */
  className?: string;
  /** base bg if no image */
  fallbackBg?: string;
};

const springValues = { damping: 30, stiffness: 100, mass: 2 };

export function TiltedCard({
  imageSrc,
  altText = "Tilted card",
  captionText = "",
  containerHeight = "100%",
  containerWidth = "100%",
  scaleOnHover = 1.06,
  rotateAmplitude = 12,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
  className,
  fallbackBg = "var(--color-muted-light)",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  const handleMouse: React.MouseEventHandler = (e) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  };

  const handleEnter = () => {
    if (reducedMotion) return;
    scale.set(scaleOnHover);
    opacity.set(1);
  };
  const handleLeave = () => {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  };

  const figureStyle: CSSProperties = {
    height: containerHeight,
    width: containerWidth,
    perspective: 800,
  };

  return (
    <figure
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative flex items-center justify-center ${className ?? ""}`}
      style={figureStyle}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          scale,
        }}
      >
        {imageSrc ? (
          <div className="absolute inset-0" style={{ transform: "translateZ(0)" }}>
            <Image
              src={imageSrc}
              alt={altText}
              fill
              sizes="(max-width: 810px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ background: fallbackBg, transform: "translateZ(0)" }}
          />
        )}
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute inset-0 z-[2]"
            style={{ willChange: "transform", transform: "translateZ(30px)" }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 z-[3] rounded-[4px] bg-white px-2.5 py-1 text-[11px] text-[#2d2d2d]"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
