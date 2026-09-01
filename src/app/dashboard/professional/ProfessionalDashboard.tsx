import { Bell, Scissors, TrendingUp } from "lucide-react";
import { DashboardSidebar } from "../_shared/components/DashboardSidebar";
import { professionalNav } from "./professional.nav";

const schedule = [["09:00", "Diego Almeida", "Corte Clássico", "R$ 85"], ["10:30", "Lucas Ferreira", "Barba real", "R$ 70"], ["13:00", "Gabriel Costa", "Combo completo", "R$ 130"]];

export function ProfessionalDashboard({ view: rawView }: { view?: string }) {
  const view = rawView ?? "conta";
  const active = professionalNav.find((item) => item.href.endsWith(`view=${view}`))?.label ?? "Minha conta";
  const agenda = <section className="member-card pro-agenda"><div className="member-card__heading"><div><h2>Agenda de hoje</h2><p>Terça-feira, 19 de novembro</p></div></div>{schedule.map((item) => <article className="pro-agenda__row" key={item[0]}><b>{item[0]}</b><div><h3>{item[1]}</h3><p>{item[2]}</p></div><strong>{item[3]}</strong><span className="member-status member-status--success">Confirmado</span></article>)}</section>;
  const content = view === "agenda" ? agenda : view === "ganhos" ? <div className="pro-earnings"><section className="member-hero"><div><p>Ganhos deste mês</p><h2>R$ 4.820,00</h2><span><TrendingUp aria-hidden="true" /> 12,5% a mais que o mês passado</span></div></section>{agenda}</div> : view === "servicos" ? <section className="member-card member-list"><h2>Meus serviços</h2>{["Corte clássico", "Barba real", "Combo completo"].map((name) => <article className="member-list__row" key={name}><Scissors aria-hidden="true" /><div><h3>{name}</h3><p>45 min</p></div><strong>R$ 85,00</strong></article>)}</section> : <section className="member-card"><h2>Enzo Ribeiro</h2><p>Barbeiro sênior · Elite Studio</p><p>Gerencie seu perfil e disponibilidade.</p></section>;
  return <section className="dashboard-shell member-dashboard professional-dashboard"><DashboardSidebar active={active} items={professionalNav} /><main className="dashboard-shell__main"><header className="member-topbar dashboard-shell__topbar"><div><h1>{active}</h1><p>Acompanhe sua rotina e seus resultados.</p></div><div className="member-topbar__profile"><Bell aria-hidden="true" /><span>Enzo Ribeiro</span><i>ER</i></div></header><div className="dashboard-shell__content member-dashboard__content">{content}</div></main></section>;
}
