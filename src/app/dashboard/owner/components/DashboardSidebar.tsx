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
import { logoutSession } from "@/features/auth/actions";
import { cn } from "@/utils/class-names";
import { ownerNav } from "../owner.nav";
import { BUSINESS } from "@/config/business";

const ICONS = {
  Painel: LayoutGrid,
  Agenda: CalendarDays,
  Barbeiros: Users,
  Serviços: List,
  Financeiro: ChartNoAxesCombined,
  Configurações: Settings,
  Profissionais: Users,
  "Novo serviço": Plus,
};

export const DashboardSidebar = ({ activeTitle }: { activeTitle: string }) => {
  return (
    <aside className="dashboard-sidebar dashboard-shell__sidebar">
      <a className="dashboard-sidebar__brand" href="/dashboard">
        <b className="dashboard-sidebar__brand-mark">
          <Sparkles aria-hidden="true" />
        </b>
        <span className="dashboard-sidebar__brand-name">{BUSINESS.name}</span>
      </a>
      <nav className="dashboard-sidebar__nav">
        {ownerNav.slice(0, 6).map(([label, href]) => {
          const Icon = ICONS[label];

          return (
            <a
              key={href}
              href={href}
              className={cn(
                "dashboard-sidebar__nav-item",
                label === activeTitle && "dashboard-sidebar__nav-item--active",
              )}
            >
              <Icon aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </nav>
      <div className="dashboard-sidebar__footer">
        <a className="dashboard-sidebar__footer-link" href="/faq">
          <CircleHelp aria-hidden="true" />
          Ajuda e suporte
        </a>
        <form
          className="dashboard-sidebar__footer-action"
          action={logoutSession}
        >
          <button className="dashboard-sidebar__footer-link" type="submit">
            <LogOut aria-hidden="true" />
            Sair
          </button>
        </form>
        <small className="dashboard-sidebar__copyright">
          © {new Date().getFullYear()} {BUSINESS.name}
        </small>
      </div>
    </aside>
  );
};
