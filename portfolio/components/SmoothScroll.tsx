"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * SmoothScroll - Lenis on desktop, native on touch.
 *
 * Critical: Lenis caches doc dimensions and uses them to clamp wheel events.
 * If lazy-loaded images extend the page AFTER Lenis measured, Lenis won't let
 * you scroll past the old cached max - feels like the page goes "stuck"
 * partway down, and only a refresh fixes it.
 *
 * Fix: force `lenis.resize()` whenever:
 *   - any <img> finishes loading (image natural size finally known)
 *   - body height changes (ResizeObserver on document.body)
 *   - window.load fires (final fallback)
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);

    if (isTouch || reducedMotion) {
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // re-measure when content grows
    const resize = () => lenis.resize();

    // every <img> on the page - fire resize when it loads
    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", resize, { once: true });
    });

    // any future image (next/image lazy-loaded into view) - catch via MutationObserver
    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((n) => {
          if (n instanceof HTMLImageElement && !n.complete) {
            n.addEventListener("load", resize, { once: true });
          } else if (n instanceof HTMLElement) {
            n.querySelectorAll?.("img").forEach((img) => {
              if (!(img as HTMLImageElement).complete) {
                img.addEventListener("load", resize, { once: true });
              }
            });
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // body height changes (anything reflowing - fonts loading, drawers, etc.)
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    // final safety net - when everything finishes loading
    window.addEventListener("load", resize);

    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("load", resize);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return null;
}
