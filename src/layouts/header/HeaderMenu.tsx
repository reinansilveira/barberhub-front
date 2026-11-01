"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/class-names";
import { NAV_LINKS } from "./header-nav";
import { isActiveLink, useHeaderMenu } from "./use-header-menu";

export function HeaderMenu({ loggedIn }: { loggedIn: boolean }) {
  const menu = useHeaderMenu();

  return (
    <>
      <button
        type="button"
        className="header__menu-toggle"
        aria-label={menu.isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menu.isOpen}
        aria-controls="header-mobile-menu"
        onClick={menu.toggle}
      >
        {menu.isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        id="header-mobile-menu"
        className={cn(
          "header__mobile-panel",
          menu.isOpen && "header__mobile-panel--open",
        )}
        hidden={!menu.isOpen}
      >
        <nav aria-label="Navegação principal" className="header__mobile-nav">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActiveLink(menu.pathname, href);
            return (
              <Link
                key={href}
                href={href}
                prefetch={false}
                onClick={menu.close}
                className={cn(
                  "header__mobile-link",
                  active && "header__mobile-link--active",
                )}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="header__mobile-actions">
          {loggedIn ? (
            <Link
              href="/dashboard"
              prefetch={false}
              onClick={menu.close}
              className="header__auth-button"
            >
              Minha conta
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                prefetch={false}
                onClick={menu.close}
                className="header__auth-button"
              >
                Entrar
              </Link>
              <Link
                href="/cadastrar"
                prefetch={false}
                onClick={menu.close}
                className="header__auth-button"
              >
                Criar conta
              </Link>
            </>
          )}
          <Link
            href="/agendar"
            prefetch={false}
            onClick={menu.close}
            className="header__mobile-cta"
          >
            Agendar agora
          </Link>
        </div>
      </div>
    </>
  );
}
