import { useState } from "react";
import { usePathname } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/hooks/use-escape-key";

export const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const useCurrentPathname = () => usePathname() ?? "/";

export function useHeaderMenu() {
  const pathname = useCurrentPathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;
  const close = () => setOpenedAt(null);

  useBodyScrollLock(isOpen);
  useEscapeKey(close, isOpen);

  return {
    close,
    isOpen,
    pathname,
    toggle: () => setOpenedAt(isOpen ? null : pathname),
  };
}
