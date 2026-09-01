import {
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  LayoutGrid,
  List,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { ownerNav } from "../owner.nav";

const ICONS = {
  Dashboard: LayoutGrid,
  Calendar: CalendarDays,
  Barbers: Users,
  Services: List,
  Financials: ChartNoAxesCombined,
  Settings,
  Profissionais: Users,
  "Novo serviço": Plus,
};

export function DashboardSidebar({ activeTitle }: { activeTitle: string }) {
  return (
    <aside className="dashboard-sidebar dashboard-shell__sidebar">
      <a className="dashboard-sidebar__brand" href="/dashboard">
        <b className="dashboard-sidebar__brand-mark">
          <Sparkles aria-hidden="true" />
        </b>
        <span className="dashboard-sidebar__brand-name">Barberhub.</span>
      </a>
      <nav className="dashboard-sidebar__nav">
        {ownerNav.slice(0, 6).map(([label, href]) => {
          const Icon = ICONS[label];

          return (
            <a
              key={href}
              href={href}
              className={`dashboard-sidebar__nav-item ${
                label === activeTitle
                  ? "dashboard-sidebar__nav-item--active"
                  : ""
              }`}
            >
              <Icon aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </nav>
      <div className="dashboard-sidebar__footer">
        <a className="dashboard-sidebar__footer-link" href="#">
          <CircleHelp aria-hidden="true" />
          Help &amp; Support
        </a>
        <a className="dashboard-sidebar__footer-link" href="#">
          <LogOut aria-hidden="true" />
          Log out
        </a>
        <small className="dashboard-sidebar__copyright">© 2024 Barberhub</small>
      </div>
    </aside>
  );
}
