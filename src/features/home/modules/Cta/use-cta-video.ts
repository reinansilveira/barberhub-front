import { useState } from "react";

export function useCtaVideo() {
  const [isVideoActive, setIsVideoActive] = useState(false);

  return { isVideoActive, activateVideo: () => setIsVideoActive(true) };
}
