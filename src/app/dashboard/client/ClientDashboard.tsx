import { Bell, Star } from "lucide-react";
import { DashboardSidebar } from "../_shared/components/DashboardSidebar";
import { clientNav } from "./client.nav";

const appointments = [
  ["24 NOV", "Corte Clássico + Barba", "Elite Studio · 15:30", "Enzo Ribeiro", "R$ 110,00"],
  ["03 DEZ", "Combo completo", "Barber King · 10:00", "Mateo Silva", "R$ 130,00"],
];

export function ClientDashboard({ view: rawView }: { view?: string }) {
  const view = rawView ?? "conta";
  const active = clientNav.find((item) => item.href.endsWith(`view=${view}`))?.label ?? "Minha conta";
  const list = <section className="member-card member-list"><div className="member-card__heading"><div><h2>Meus agendamentos</h2><p>Acompanhe seus próximos horários.</p></div></div>{appointments.map((item) => <article className="member-list__row" key={item[0]}><b>{item[0]}</b><div><h3>{item[1]}</h3><p>{item[2]} · com {item[3]}</p></div><strong>{item[4]}</strong><span className="member-status member-status--success">Confirmado</span></article>)}</section>;
  const content = view === "agendamentos" ? list : <div className="member-home"><section className="member-hero"><div><p>Olá, Camila! 👋</p><h2>Seu próximo corte está chegando.</h2><span>Domingo, 24 de novembro · 15:30</span></div></section>{view === "conta" ? <section className="member-card"><h2>Camila Souza</h2><p>camila.souza@email.com</p><div className="member-stat-grid"><article><small>Atendimentos</small><b>24</b></article><article><small>Média dada</small><b>4,9 <Star aria-hidden="true" /></b></article><article><small>Total gasto</small><b>R$ 1,8k</b></article></div></section> : list}</div>;
  return <section className="dashboard-shell member-dashboard"><DashboardSidebar active={active} items={clientNav} /><main className="dashboard-shell__main"><header className="member-topbar dashboard-shell__topbar"><div><h1>{active}</h1><p>Gerencie seus dados, preferências e histórico.</p></div><div className="member-topbar__profile"><Bell aria-hidden="true" /><span>Camila Souza</span><i>CS</i></div></header><div className="dashboard-shell__content member-dashboard__content">{content}</div></main></section>;
}
