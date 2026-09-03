"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ProductGallery({
  images,
  productName,
  fallbackLabel,
}: {
  images: string[];
  productName: string;
  fallbackLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToIndex = useCallback((index: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollTo({
      left: track.clientWidth * index,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frame = 0;

    const syncActiveIndex = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(track.scrollLeft / track.clientWidth);

        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index;
          setActiveIndex(index);
        }
      });
    };

    // Ao mudar de breakpoint a largura do slide muda: reancorar no slide atual.
    const observer = new ResizeObserver(() => {
      track.scrollLeft = track.clientWidth * activeIndexRef.current;
    });

    track.addEventListener("scroll", syncActiveIndex, { passive: true });
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", syncActiveIndex);
      observer.disconnect();
    };
  }, []);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-end bg-secondary bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_45%)] p-6">
        <span className="text-sm font-medium text-foreground/80">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  const isSingle = images.length === 1;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= images.length - 1;

  return (
    <div
      role="group"
      aria-roledescription="carrossel"
      aria-label={`Imagens de ${productName}`}
      onKeyDown={(event) => {
        if (isSingle) {
          return;
        }

        if (event.key === "ArrowRight" && !isLast) {
          event.preventDefault();
          goToIndex(activeIndex + 1);
        }

        if (event.key === "ArrowLeft" && !isFirst) {
          event.preventDefault();
          goToIndex(activeIndex - 1);
        }
      }}
    >
      <div
        className={cn("relative", isSingle ? undefined : "border-b border-border/70")}
      >
        <div
          ref={trackRef}
          tabIndex={0}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {images.map((image, index) => (
            <div
              key={image}
              role="group"
              aria-roledescription="slide"
              aria-label={`Imagem ${index + 1} de ${images.length}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-product-plate"
            >
              <Image
                src={image}
                alt={
                  index === 0
                    ? productName
                    : `${productName} — vista ${index + 1}`
                }
                fill
                priority={index === 0}
                className="object-contain p-6 sm:p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {isSingle ? null : (
          <>
            <button
              type="button"
              onClick={() => goToIndex(activeIndex - 1)}
              disabled={isFirst}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goToIndex(activeIndex + 1)}
              disabled={isLast}
              aria-label="Imagem seguinte"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="size-4" />
            </button>

            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-border/70 bg-background/70 px-2.5 py-0.5 text-xs font-medium tabular-nums text-foreground backdrop-blur">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {isSingle ? null : (
        <div className="no-scrollbar flex gap-3 overflow-x-auto p-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-2xl border bg-product-plate transition-opacity",
                index === activeIndex
                  ? "border-primary opacity-100"
                  : "border-border/70 opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      <span aria-live="polite" className="sr-only">
        {`Imagem ${activeIndex + 1} de ${images.length}`}
      </span>
    </div>
  );
}
