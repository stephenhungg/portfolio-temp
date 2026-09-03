import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & { children?: ReactNode };

// container: yuya match - content area starts at x=80 on desktop, max 1280
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto max-w-[1440px]",
        "px-5 tablet:px-9 desktop:px-20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionProps<E extends ElementType = "section"> = {
  as?: E;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<E>, "as" | "className" | "children">;

// section: vertical padding 40 mobile / 60 tablet / 80 desktop
export function Section<E extends ElementType = "section">({
  as,
  children,
  className,
  ...props
}: SectionProps<E>) {
  const Component = (as || "section") as ElementType;
  return (
    <Component
      className={cn(
        "py-10 tablet:py-[60px] desktop:py-20",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

type StackSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
const stackGap: Record<StackSize, string> = {
  xs: "gap-[5px]",
  sm: "gap-[8px]",
  md: "gap-[12px]",
  lg: "gap-[16px]",
  xl: "gap-[20px]",
  "2xl": "gap-[24px]",
  "3xl": "gap-[30px]",
};

type StackProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  size?: StackSize;
  direction?: "vertical" | "horizontal";
};

export function Stack({
  children,
  className,
  size = "md",
  direction = "vertical",
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        stackGap[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
