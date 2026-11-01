"use client";

import Link from "next/link";
import { cn } from "@/utils/class-names";
import { NAV_LINKS } from "./header-nav";
import { isActiveLink, useCurrentPathname } from "./use-header-menu";

export function HeaderNav() {
  const pathname = useCurrentPathname();

  return (
    <nav className="header__nav" aria-label="Navegação principal">
      {NAV_LINKS.map(({ label, href }) => {
        const active = isActiveLink(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            prefetch={false}
            className={cn(
              "header__nav-link",
              active && "header__nav-link--active",
            )}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
