import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { Kpi, OwnerView } from "../owner.types";
import { DashboardOverview } from "./DashboardOverview";
import { ClientsPanel } from "./ClientsPanel";
import { MetricsPanel } from "./MetricsPanel";
import { ProfessionalsPanel } from "./ProfessionalsPanel";
import { ServicesPanel } from "./ServicesPanel";
import { SummaryPanel } from "./SummaryPanel";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";

export const DashboardContent = ({
    view,
    appointments,
    services,
    clients,
    recent,
    revenue,
    completedCount,
    kpis,
    revenueChartModel,
}: {
    view: OwnerView;
    appointments: Appointment[];
    services: Service[];
    clients: string[];
    recent: Appointment[];
    revenue: number;
    completedCount: number;
    kpis: Kpi[];
    revenueChartModel: RevenueChartModel;
}) => {
    switch (view) {
        case "dashboard":
            return <DashboardOverview appointments={appointments} services={services} />;
        case "clientes":
            return <ClientsPanel appointments={appointments} clients={clients} />;
        case "metricas":
            return <MetricsPanel kpis={kpis} />;
        case "profissionais":
            return <ProfessionalsPanel />;
        case "catalogo":
        case "novo-servico":
            return <ServicesPanel />;
        default:
            return (
                <SummaryPanel
                    appointments={appointments}
                    services={services}
                    recent={recent}
                    revenue={revenue}
                    completedCount={completedCount}
                    clientsCount={clients.length}
                    revenueChartModel={revenueChartModel}
                />
            );
    }
}