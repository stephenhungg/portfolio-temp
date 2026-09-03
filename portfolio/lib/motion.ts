import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

export function registerGsap() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(CustomEase, ScrollTrigger, Flip);

  CustomEase.create("yuyaPrimary", "0.42 0.21 0 1");
  CustomEase.create("yuyaScale", "0 0.13 0 0.98");
  CustomEase.create("yuyaInOut", "0.44 0 0.56 1");

  registered = true;
}

export const yuyaMotion = {
  durations: {
    primary: 1.2,
    secondary: 0.8,
    fast: 0.4,
  },
  delays: {
    secondaryStagger: 0.6,
  },
  eases: {
    primary: "yuyaPrimary",
    scale: "yuyaScale",
    inOut: "yuyaInOut",
  },
} as const;

export type AppearVariant = "y-100-up" | "y175-up" | "y265-up" | "y485-up" | "scale-in";

export function appearProps(variant: AppearVariant) {
  switch (variant) {
    case "y-100-up":
      return { from: { y: -100, opacity: 0.001 }, to: { y: 0, opacity: 1, ease: yuyaMotion.eases.primary, duration: yuyaMotion.durations.primary } };
    case "y175-up":
      return { from: { y: 175, opacity: 0.001 }, to: { y: 0, opacity: 1, ease: yuyaMotion.eases.primary, duration: yuyaMotion.durations.primary } };
    case "y265-up":
      return { from: { y: 265, opacity: 0.001 }, to: { y: 0, opacity: 1, ease: yuyaMotion.eases.primary, duration: yuyaMotion.durations.primary } };
    case "y485-up":
      return { from: { y: 485, opacity: 0.001 }, to: { y: 0, opacity: 1, ease: yuyaMotion.eases.primary, duration: yuyaMotion.durations.primary } };
    case "scale-in":
      return { from: { scale: 0, opacity: 0.001 }, to: { scale: 1, opacity: 1, ease: yuyaMotion.eases.scale, duration: yuyaMotion.durations.primary } };
  }
}
