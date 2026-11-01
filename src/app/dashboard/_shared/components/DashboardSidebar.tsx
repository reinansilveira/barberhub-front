import type { LucideIcon } from "lucide-react";
import { CircleHelp, LogOut, Scissors } from "lucide-react";
import { logoutSession } from "@/features/auth/actions";
import { cn } from "@/utils/class-names";
import { BUSINESS } from "@/config/business";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function DashboardSidebar({
  active,
  items,
}: {
  active: string;
  items: DashboardNavItem[];
}) {
  return (
    <aside className="member-sidebar dashboard-shell__sidebar">
      <a className="member-sidebar__brand" href="/dashboard">
        <span className="member-sidebar__brand-mark">
          <Scissors aria-hidden="true" />
        </span>
        <b>{BUSINESS.name}</b>
      </a>
      <nav className="member-sidebar__nav" aria-label="Navegação da conta">
        {items.map(({ label, href, icon: Icon }) => (
          <a
            className={cn(
              "member-sidebar__link",
              active === label && "member-sidebar__link--active",
            )}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="member-sidebar__footer">
        <a href="/faq">
          <CircleHelp aria-hidden="true" /> Ajuda e suporte
        </a>
        <form className="member-sidebar__footer-action" action={logoutSession}>
          <button type="submit">
            <LogOut aria-hidden="true" /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
