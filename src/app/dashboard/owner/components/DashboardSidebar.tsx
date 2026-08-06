import Link from "next/link";
import { ownerNav } from "../owner.nav";

const icons: Record<string, string> = {
  "Visão geral": "⌂",
  Agenda: "▣",
  Clientes: "♟",
  Catálogo: "▤",
  Métricas: "⌁",
  Configurações: "⚙",
};

export const DashboardSidebar = ({ activeTitle }: { activeTitle: string }) => {
  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        BarberHub
        <span>2</span>
      </Link>

      <nav>
        {ownerNav.map(([label, href]) => (
          <Link href={href} className={activeTitle === label ? "active" : ""} key={label}>
            <i>{icons[label] ?? "⚙"}</i>
            {label}
          </Link>
        ))}
      </nav>

      <div className="support">
        ?{" "}
        <span>
          <b>Precisa de ajuda?</b>
          Fale com o suporte
        </span>
      </div>
    </aside>
  );
}