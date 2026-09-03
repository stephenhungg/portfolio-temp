"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { registerGsap } from "@/lib/motion";
import { useSetLoaderReady } from "@/lib/loader-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  images: string[];
  storageKey?: string;
};

/**
 * Loader - studioolimpo motion (audited from live DOM).
 *
 *   counter 0→100 over 2946ms with power2.out (fast start, slow tail)
 *   logo + image enter at t≈276ms via masked-lines reveal (yPercent 100 → 0)
 *   image cycle starts at t=1100ms and runs for 2100ms
 *   image exits at t=3772ms, followed by the logo at t=4472ms
 *   650ms white hold, then a 550ms loader fade
 *
 * IMAGES SNAP between cycles (no cross-fade - matches olimpo's transition: 0s).
 * Only the WRAPPING image block has motion (the masked entrance/exit).
 *
 * Plays once per session and exits in about 6.4 seconds. Reduced-motion users
 * skip it entirely so content is immediately available.
 */
export function Loader({
  images,
  storageKey = "stpn-loader-shown",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const setLoaderReady = useSetLoaderReady();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // skip if loader already played this session or motion is reduced
    if (reducedMotion || sessionStorage.getItem(storageKey) === "1") {
      setDone(true);
      setLoaderReady(true);
      return;
    }
    sessionStorage.setItem(storageKey, "1");
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [storageKey, setLoaderReady, reducedMotion]);

  useEffect(() => {
    if (!mounted) return;
    registerGsap();
    const overlay = overlayRef.current;
    const textInner = textInnerRef.current;
    const imageInner = imageInnerRef.current;
    if (!overlay || !textInner || !imageInner) return;

    // initial state - both blocks below their masks (yPercent 100 = fully translated down)
    gsap.set([textInner, imageInner], { yPercent: 100 });

    // entrance: TEXT first, THEN images. masked-lines reveal (yPercent 100 → 0).
    // image mask is slower (1.2s) so the rise feels deliberate, not snappy.
    const enter = gsap.timeline({ delay: 0.276 });
    enter.to(textInner, {
      yPercent: 0,
      duration: 0.7,
      ease: "expo.out",
    }, 0);
    enter.to(imageInner, {
      yPercent: 0,
      duration: 1.2,
      ease: "expo.out",
    }, 0.4);

    // counter 0→100 ease-out over 2946ms (matches captured curve)
    const counterObj = { c: 0 };
    gsap.to(counterObj, {
      c: 100,
      duration: 2.946,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(counterObj.c)),
    });

    // image cycle - linear stepping, snap-cuts between images (no cross-fade)
    // delay until mask reveal mostly completes so image 0 isn't truncated mid-mask
    const imgObj = { i: 0 };
    gsap.to(imgObj, {
      i: images.length - 0.001,
      duration: 2.1,
      delay: 1.1,
      ease: "none",
      onUpdate: () => setImgIdx(Math.floor(imgObj.i)),
    });

    // exit: IMAGES first (slower mask, 1.2s), then text, then a WHITE HOLD beat,
    // then bg fades and we hand off to the page's hero entrance animations.
    const exit = gsap.timeline({ delay: 3.772 });
    exit.to(imageInner, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.in",
    }, 0);
    exit.to(textInner, {
      yPercent: -100,
      duration: 0.7,
      ease: "expo.in",
    }, 0.7);
    exit.to(overlay, {
      autoAlpha: 0,
      duration: 0.55,
      ease: "power1.out",
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
        // signal the rest of the app that hero/page entrance animations can fire
        setLoaderReady(true);
      },
    }, "+=0.65");

    return () => {
      gsap.killTweensOf([textInner, imageInner, overlay, counterObj, imgObj]);
      enter.kill();
      exit.kill();
    };
  }, [mounted, images.length]);

  if (done || !mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center"
      aria-hidden
      style={{ background: "#FFFFFF" }}
    >
      {/* logo + counter row - masked-lines reveal */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: "50%",
          top: "33%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          ref={textInnerRef}
          className="flex items-center font-sans"
          style={{
            color: "#0D0D0D",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            gap: "110px",
            willChange: "transform",
          }}
        >
          <span>stephen hung</span>
          <span className="tabular-nums">{count}</span>
        </div>
      </div>

      {/* image - masked block. images inside SNAP between cycles, no transition */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: "50%",
          top: "33%",
          transform: "translate(-50%, 12px)",
          width: 225,
          height: 282,
        }}
      >
        <div
          ref={imageInnerRef}
          className="relative w-full h-full"
          style={{ willChange: "transform" }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0"
              style={{
                opacity: i === imgIdx ? 1 : 0,
                // no transition - snap-cut between images
                transition: "none",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="225px"
                className="object-cover"
                style={{ filter: "grayscale(100%)" }}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
