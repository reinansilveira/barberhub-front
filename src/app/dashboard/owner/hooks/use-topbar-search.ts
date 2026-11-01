import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { filterSuggestions, type TopbarSuggestion } from "../topbar.utils";

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function useTopbarSearch(services: string[]) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useOutsideClick(() => setIsOpen(false), isOpen);

  useEffect(() => {
    const focusOnSlash = (event: KeyboardEvent) => {
      if (event.key !== "/" || isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, []);

  return {
    containerRef,
    inputRef,
    isOpen,
    matches: filterSuggestions(query, services),
    query,
    clear: () => setQuery(""),
    open: () => setIsOpen(true),
    change: (value: string) => {
      setQuery(value);
      setIsOpen(true);
    },
    closeOnEscape: (key: string) => {
      if (key === "Escape") setIsOpen(false);
    },
    select: (item: TopbarSuggestion) => {
      router.push(item.href);
      setIsOpen(false);
      setQuery("");
    },
  };
}
