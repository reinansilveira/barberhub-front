import type { LucideIcon } from "lucide-react";
import { CircleHelp, LogOut, Scissors } from "lucide-react";
import Link from "next/link";

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
        <span className="member-sidebar__brand-mark"><Scissors aria-hidden="true" /></span>
        <b>Barberhub</b>
      </a>
      <nav className="member-sidebar__nav" aria-label="Navegação da conta">
        {items.map(({ label, href, icon: Icon }) => (
          <a
            className={`member-sidebar__link ${active === label ? "member-sidebar__link--active" : ""}`}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="member-sidebar__footer">
        <a href="#ajuda"><CircleHelp aria-hidden="true" /> Ajuda e suporte</a>
        <Link href="/"><LogOut aria-hidden="true" /> Sair</Link>
      </div>
    </aside>
  );
}
