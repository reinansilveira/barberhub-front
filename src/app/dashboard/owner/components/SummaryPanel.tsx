import Link from "next/link";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import { currency, isCompleted } from "../../_shared/dashboard.utils";
import { RevenueChart } from "./RevenueChart";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";

export const SummaryPanel = ({
  appointments,
  services,
  recent,
  revenue,
  completedCount,
  clientsCount,
  revenueChartModel,
}: {
  appointments: Appointment[];
  services: Service[];
  recent: Appointment[];
  revenue: number;
  completedCount: number;
  clientsCount: number;
  revenueChartModel: RevenueChartModel;
}) => {
  return (
    <>
      <section className="metrics">
        <article>
          <small>Vendas concluídas</small>
          <strong>{currency.format(revenue)}</strong>
          <span>{completedCount} agendamento(s) concluído(s)</span>
        </article>
        <article>
          <small>Agendamentos</small>
          <strong>{appointments.length}</strong>
          <span>{appointments.filter((item) => !isCompleted(item.status)).length} aguardando atendimento</span>
        </article>
        <article>
          <small>Clientes</small>
          <strong>{clientsCount}</strong>
          <span>Base de clientes ativa</span>
        </article>
        <article>
          <small>Serviços ativos</small>
          <strong>{services.length}</strong>
          <span>Disponíveis para agendamento</span>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <div className="panelTitle">
            <div>
              <small>ATIVIDADE</small>
              <h2>Agendamentos recentes</h2>
            </div>
            <Link href="/dashboard?view=agenda">Ver agenda</Link>
          </div>

          <div className="appointments">
            {recent.map((item) => (
              <article key={item.id}>
                <time>
                  {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
                    new Date(item.scheduledAt),
                  )}
                </time>
                <div>
                  <b>{item.client.name}</b>
                  <small>
                    {item.service.name} ·{" "}
                    {new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(
                      new Date(item.scheduledAt),
                    )}
                  </small>
                </div>
                <em className={isCompleted(item.status) ? "complete" : "pending"}>
                  {isCompleted(item.status) ? "Concluído" : "Pendente"}
                </em>
                <strong>{currency.format(Number(item.price || 0))}</strong>
              </article>
            ))}
            {!recent.length && <p>Nenhum agendamento registrado.</p>}
          </div>
        </article>

        <article className="panel">
          <div className="panelTitle">
            <div>
              <small>DESEMPENHO</small>
              <h2>Resumo financeiro</h2>
            </div>
          </div>
          <RevenueChart model={revenueChartModel} />
        </article>
      </section>
    </>
  );
}