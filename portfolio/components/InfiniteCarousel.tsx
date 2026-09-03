"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import Image from "next/image";
import { registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Card = {
  slug: string;
  title: string;
  image?: string;
  href: string;
};

type Props = {
  cards: Card[];
  className?: string;
};

type CarouselControls = {
  next: () => void;
  prev: () => void;
};

const spacing = 0.2;
const overlapCount = 5;

function buildSeamlessLoop(
  items: HTMLLIElement[],
  animateItem: (item: HTMLLIElement) => gsap.core.Timeline,
) {
  const startTime = spacing * items.length + 0.5;
  const loopTime = (items.length + overlapCount) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      const timeline = this as unknown as gsap.core.Timeline & {
        _dur: number;
        _time: number;
        _tTime: number;
      };

      if (timeline._time === timeline._dur) {
        timeline._tTime += timeline._dur - 0.01;
      }
    },
  });

  const sequenceLength = items.length + overlapCount * 2;
  for (let index = 0; index < sequenceLength; index += 1) {
    const itemIndex = index % items.length;
    const time = spacing * index;
    rawSequence.add(animateItem(items[itemIndex]), time);
    if (index <= items.length) seamlessLoop.add(`label${index}`, time);
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none",
    })
    .fromTo(
      rawSequence,
      { time: spacing * overlapCount + 1 },
      {
        time: startTime,
        duration: startTime - (spacing * overlapCount + 1),
        immediateRender: false,
        ease: "none",
      },
    );

  return seamlessLoop;
}

export function InfiniteCarousel({ cards, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<CarouselControls>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      gsap.registerPlugin(Draggable);

      const list = listRef.current;
      const dragProxy = dragProxyRef.current;
      if (!list || !dragProxy) return;

      const items = gsap.utils.toArray<HTMLLIElement>(list.querySelectorAll("li"));
      if (items.length === 0) return;

      gsap.set(items, { xPercent: 180, opacity: 0, scale: 0 });

      const snap = gsap.utils.snap(spacing);
      const seamlessLoop = buildSeamlessLoop(items, (item) => {
        const timeline = gsap.timeline();
        timeline
          .fromTo(
            item,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              zIndex: 100,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "sine.inOut",
              immediateRender: false,
            },
          )
          .fromTo(
            item,
            { xPercent: 180 },
            {
              xPercent: -180,
              duration: 1,
              ease: "none",
              immediateRender: false,
            },
            0,
          );
        return timeline;
      });

      const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
      const playhead = { offset: 0 };
      const scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() {
          seamlessLoop.time(wrapTime(playhead.offset));
        },
        duration: reducedMotion ? 0 : 0.5,
        ease: "power3",
        paused: true,
      });

      function moveTo(offset: number) {
        const snappedOffset = snap(offset);
        scrub.vars.offset = snappedOffset;
        scrub.invalidate().restart();
      }

      controlsRef.current = {
        next: () => moveTo((scrub.vars.offset ?? 0) + spacing),
        prev: () => moveTo((scrub.vars.offset ?? 0) - spacing),
      };

      const initialOffset = snap(seamlessLoop.duration() / 2);
      playhead.offset = initialOffset;
      scrub.vars.offset = initialOffset;
      seamlessLoop.time(wrapTime(initialOffset));

      let dragStartOffset = initialOffset;
      const draggable = Draggable.create(dragProxy, {
        type: "x",
        trigger: list,
        onPress() {
          dragStartOffset = scrub.vars.offset ?? 0;
        },
        onDrag() {
          scrub.vars.offset = dragStartOffset + (this.startX - this.x) * 0.001;
          scrub.invalidate().restart();
        },
        onDragEnd() {
          moveTo(scrub.vars.offset ?? 0);
        },
      })[0];

      return () => {
        controlsRef.current = null;
        seamlessLoop.kill();
        scrub.kill();
        draggable.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [cards, reducedMotion],
      revertOnUpdate: true,
    },
  );

  if (cards.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[520px] w-full overflow-hidden tablet:h-[640px] desktop:h-[720px]",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="featured projects"
    >
      <ul
        ref={listRef}
        className="absolute left-1/2 top-1/2 m-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 list-none p-0"
      >
        {cards.map((card, index) => (
          <li
            key={card.slug}
            className="absolute left-0 top-0 m-0 aspect-square w-[30rem] list-none overflow-hidden bg-muted-light p-0"
          >
            <Link
              href={card.href}
              data-cursor-text="View"
              className="group relative block h-full w-full"
              aria-label={`${card.title}, project ${index + 1} of ${cards.length}`}
            >
              {card.image ? (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 810px) 90vw, 480px"
                  className="object-cover"
                  priority={index === 0 || index === Math.ceil(cards.length / 2)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 font-sans text-[36px] font-medium tracking-[-0.04em] text-foreground">
                  {card.title}
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6 tablet:p-7">
                <span className="font-sans text-[24px] font-medium tracking-[-0.04em] text-white tablet:text-[28px]">
                  {card.title}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          onClick={() => controlsRef.current?.prev()}
          aria-label="previous"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white hover:bg-muted-dark [transition:background-color_400ms_cubic-bezier(0.42,0.21,0,1)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 1L3 7l6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.next()}
          aria-label="next"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white hover:bg-muted-dark [transition:background-color_400ms_cubic-bezier(0.42,0.21,0,1)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 1l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div
        ref={dragProxyRef}
        className="pointer-events-none absolute opacity-0"
        style={{ left: 0, top: 0, width: 1, height: 1 }}
      />
    </div>
  );
}
