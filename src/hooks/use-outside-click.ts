import { useEffect, useEffectEvent, useRef } from "react";

export function useOutsideClick<T extends HTMLElement = HTMLDivElement>(
  onOutsideClick: () => void,
  enabled = true,
) {
  const containerRef = useRef<T>(null);
  const handleOutsideClick = useEffectEvent(onOutsideClick);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        handleOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [enabled]);

  return containerRef;
}
