import { useState } from "react";

export function useImageError() {
  const [failed, setFailed] = useState(false);
  return { failed, onError: () => setFailed(true) };
}
