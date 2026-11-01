import { useEffect, useEffectEvent } from "react";

export function useEscapeKey(onEscape: () => void, enabled = true) {
  const handleEscape = useEffectEvent(onEscape);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleEscape();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
