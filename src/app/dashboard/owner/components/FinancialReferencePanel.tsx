import type { Appointment } from "@/services/appointment";
import { RevenueLineChart } from "@/components/shadcn/RevenueLineChart";
import { cn } from "@/utils/class-names";
import { currency } from "../../_shared/dashboard.utils";
import { exportFinancialReport } from "../financial-report";
import type { RevenueChartModel } from "../revenue-chart.utils";
import type { ReferencePanelsModel } from "../hooks/use-reference-panels";
import type { Payment } from "../owner.types";
import { paymentProfessionalName, paymentServiceName } from "../owner.utils";
import { MiniStats, PageHead } from "./ReferencePanelPrimitives";

export const FinancialReferencePanel = ({
  appointments,
  payments,
  revenueChartModel,
  financial,
}: {
  appointments: Appointment[];
  payments: Payment[];
  revenueChartModel: RevenueChartModel;
  financial: ReferencePanelsModel["financial"];
}) => {
  return (
    <div className="reference-page financial-page">
      <PageHead
        title="Financeiro"
        subtitle="Acompanhe suas receitas, despesas e desempenho"
        action="⇩ Exportar relatório"
        onAction={() => exportFinancialReport(payments)}
      />
      <MiniStats
        items={[
          [
            "wallet",
            "Receita total",
            currency.format(financial.totalRevenue),
            "",
          ],
          [
            "pending",
            "Ticket médio",
            currency.format(financial.averageTicket),
            "",
          ],
          ["calendar", "Agendamentos totais", String(appointments.length), ""],
          [
            "cancelled",
            "Cancelamentos",
            String(
              appointments.filter((item) => /cancel/i.test(item.status)).length,
            ),
            "",
          ],
        ]}
      />
      <section className="reference-panel revenue-overview financial-page__revenue-overview financial-metrics-card">
        <div className="financial-metrics-card__head">
          <div>
            <h2>
              Receita{" "}
              {financial.period === "week"
                ? "semanal"
                : financial.period === "month"
                  ? "mensal"
                  : "anual"}
            </h2>
            <strong>{currency.format(financial.periodRevenue)}</strong>
          </div>
          <div
            className="financial-metrics-card__periods"
            role="group"
            aria-label="Período da receita"
          >
            {(["week", "month", "year"] as const).map((period) => (
              <button
                type="button"
                key={period}
                className={cn(
                  "financial-metrics-card__period",
                  financial.period === period &&
                    "financial-metrics-card__period--active",
                )}
                aria-pressed={financial.period === period}
                onClick={() => financial.setPeriod(period)}
              >
                {period === "week"
                  ? "Semana"
                  : period === "month"
                    ? "Mês"
                    : "Ano"}
              </button>
            ))}
          </div>
        </div>
        <RevenueLineChart model={revenueChartModel} period={financial.period} />
      </section>
      <TransactionTable payments={payments} />
    </div>
  );
};

const TransactionTable = ({ payments }: { payments: Payment[] }) => {
  return (
    <section className="reference-panel transactions financial-page__transactions">
      <div className="reference-panel__head">
        <h2>Transações recentes</h2>
        <span>Até 8 registros</span>
      </div>
      <div className="transaction-table__head">
        <span>ID da transação</span>
        <span>Data</span>
        <span>Serviço</span>
        <span>Barbeiro</span>
        <span>Valor</span>
        <span>Status</span>
      </div>
      {payments.length === 0 && (
        <p className="empty">Nenhuma transação encontrada.</p>
      )}
      {payments.slice(0, 8).map((item) => (
        <div className="transaction-table__row" key={item.id}>
          <span>#{item.id.slice(0, 8).toUpperCase()}</span>
          <span>
            {item.paidAt || item.createdAt
              ? new Intl.DateTimeFormat("pt-BR").format(
                  new Date(item.paidAt ?? item.createdAt!),
                )
              : "—"}
          </span>
          <b>{paymentServiceName(item) || "Serviço não informado"}</b>
          <span>{paymentProfessionalName(item) || "Não informado"}</span>
          <b>{currency.format(Number(item.finalAmount || 0))}</b>
          <em>
            {item.status === "PAID"
              ? "Pago"
              : item.status === "REFUNDED"
                ? "Estornado"
                : "Pendente"}
          </em>
        </div>
      ))}
    </section>
  );
};
