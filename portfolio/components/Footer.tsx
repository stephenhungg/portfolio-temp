"use client";

import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "mt-auto bg-foreground text-white",
        "min-h-screen flex flex-col",
        className,
      )}
    >
      <div className="px-5 tablet:px-9 desktop:px-20 flex-1 flex flex-col justify-between py-10 tablet:py-12">
        {/* top: socials right-aligned */}
        <div className="flex justify-end gap-7">
          <Link
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-11 min-w-11 px-2 font-sans text-[16px] font-medium yuya-link hover:text-muted-medium"
          >
            linkedin
          </Link>
          <Link
            href={site.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-11 min-w-11 px-2 font-sans text-[16px] font-medium yuya-link hover:text-muted-medium"
          >
            x
          </Link>
          <Link
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-11 min-w-11 px-2 font-sans text-[16px] font-medium yuya-link hover:text-muted-medium"
          >
            github
          </Link>
        </div>

        {/* middle: tagline + pills (vertically centered region) */}
        <div className="flex flex-col gap-10 tablet:gap-12">
          <div className="max-w-4xl">
            <p
              className={cn(
                "font-sans font-medium text-[28px] tablet:text-[40px] desktop:text-[48px]",
                "leading-[1.15] tracking-[-0.04em]",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-white from-50% to-white/30",
              )}
            >
              open to internships, hackathons, and freelance projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center",
                "py-4 px-7 bg-white text-foreground",
                "font-sans text-[16px] font-medium tracking-[-0.04em]",
                "[transition:background-color_400ms_cubic-bezier(0.42,0.21,0,1),color_400ms_cubic-bezier(0.42,0.21,0,1)]",
                "hover:bg-muted-light",
              )}
            >
              get in touch
            </Link>
          </div>
        </div>

        {/* bottom: 3-col row */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 tablet:gap-10 font-sans text-[16px] font-normal leading-[1.4]">
          <div className="flex flex-col gap-0.5">
            <Link href={`mailto:${site.email}`} className="inline-flex items-center min-h-11 yuya-link">
              {site.email}
            </Link>
            <span className="text-muted-medium">berkeley, ca</span>
          </div>

          <div className="flex flex-col gap-0.5 tablet:items-start">
            <span>designed &amp; developed</span>
            <span className="text-muted-medium">by stephen hung</span>
          </div>

          <div className="flex flex-col gap-0.5 tablet:items-end tablet:text-right">
            <span>all rights reserved,</span>
            <span className="text-muted-medium">stephen hung &copy;{year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
