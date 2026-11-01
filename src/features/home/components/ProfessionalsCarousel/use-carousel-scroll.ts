import { useRef } from "react";

const SCROLL_RATIO = 0.85;

export function useCarouselScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const amount = track.clientWidth * SCROLL_RATIO;
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return { trackRef, scroll };
}
