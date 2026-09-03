import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  className?: string;
  variant?: "primary" | "ghost";
};

const base =
  "inline-flex items-center justify-center font-sans text-[16px] font-medium tracking-[-0.04em] " +
  "py-4 px-[26px] whitespace-nowrap " +
  // yuya pill hover: bg + color flip with primary easing for satisfying snap
  "[transition:background-color_400ms_cubic-bezier(0.42,0.21,0,1),color_400ms_cubic-bezier(0.42,0.21,0,1)]";

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-foreground text-white hover:bg-muted-dark",
  // ghost flips to black/white on hover - yuya pattern
  ghost:
    "bg-muted-light text-foreground hover:bg-foreground hover:text-white",
};

type LinkPillProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className">;

export function PillLink({ className, variant = "ghost", children, ...props }: LinkPillProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}

type ButtonPillProps = BaseProps & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function PillButton({ className, variant = "ghost", children, ...props }: ButtonPillProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
