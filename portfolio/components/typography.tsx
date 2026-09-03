import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props<E extends keyof React.JSX.IntrinsicElements = "div"> = ComponentPropsWithoutRef<E> & { children?: ReactNode };

const displayHeroClassName =
  "font-sans font-semibold leading-[1.0] text-[64px] tablet:text-[120px] desktop:text-[174px] tracking-[-0.09em]";

// displayHero: yuya match - 174px/600/1.0/-0.09em letter-spacing
export function DisplayHero({ children, className, ...props }: Props<"h1">) {
  return (
    <h1
      className={cn(
        displayHeroClassName,
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function DisplayHeroText({ children, className, ...props }: Props<"span">) {
  return (
    <span className={cn("block", displayHeroClassName, className)} {...props}>
      {children}
    </span>
  );
}

// displayLarge: 40px, weight 500, line 1.1, letter -0.06em
export function DisplayLarge({ children, className, ...props }: Props<"h2">) {
  return (
    <h2
      className={cn(
        "font-sans font-medium leading-[1.1]",
        "text-[40px] tracking-[-0.06em]",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

// displayMedium: 32px, weight 500, line 1.1, letter -0.06em
export function DisplayMedium({ children, className, ...props }: Props<"h3">) {
  return (
    <h3
      className={cn(
        "font-sans font-medium leading-[1.1]",
        "text-[32px] tracking-[-0.06em]",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// heading: 24px, weight 500, line 1.2, letter -0.03em
export function Heading({ children, className, ...props }: Props<"h4">) {
  return (
    <h4
      className={cn(
        "font-sans font-medium leading-[1.2]",
        "text-[24px] tracking-[-0.03em]",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

// headingSmall: 19px, weight 500, line 1.2, letter -0.03em
export function HeadingSmall({ children, className, ...props }: Props<"h5">) {
  return (
    <h5
      className={cn(
        "font-sans font-medium leading-[1.2]",
        "text-[19px] tracking-[-0.03em]",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

// bodyRegular: 16px, weight 400, line 1.4
export function Body({ children, className, ...props }: Props<"p">) {
  return (
    <p className={cn("font-sans font-normal text-[16px] leading-[1.4]", className)} {...props}>
      {children}
    </p>
  );
}

// bodySmall: 14px, weight 400, line 1.4
export function BodySmall({ children, className, ...props }: Props<"p">) {
  return (
    <p className={cn("font-sans font-normal text-[14px] leading-[1.4]", className)} {...props}>
      {children}
    </p>
  );
}

// label: 14px, weight 500, line 1.2
export function Label({ children, className, ...props }: Props<"span">) {
  return (
    <span
      className={cn("font-sans font-medium text-[14px] leading-[1.2]", className)}
      {...props}
    >
      {children}
    </span>
  );
}

// caption: 12px, weight 400, line 1.2
export function Caption({ children, className, ...props }: Props<"span">) {
  return (
    <span
      className={cn("font-sans font-normal text-[12px] leading-[1.2]", className)}
      {...props}
    >
      {children}
    </span>
  );
}

// code: 14px Fragment Mono, weight 400, line 1.4
export function Code({ children, className, ...props }: Props<"code">) {
  return (
    <code className={cn("font-mono font-normal text-[14px] leading-[1.4]", className)} {...props}>
      {children}
    </code>
  );
}

// eyebrow - small uppercase label often above sections
export function Eyebrow({ children, className, ...props }: Props<"span">) {
  return (
    <span
      className={cn("font-mono font-normal text-[12px] leading-[1.2] uppercase tracking-[0.05em]", className)}
      {...props}
    >
      {children}
    </span>
  );
}
