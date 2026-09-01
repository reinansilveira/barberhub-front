import { DashboardOverview } from "./DashboardOverview";
import { ReferencePanels } from "./ReferencePanels";
import { ClientsPanel } from "./ClientsPanel";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { Kpi, OwnerView } from "../owner.types";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";

type DashboardContentProps = {
    view: OwnerView;
    appointments: Appointment[];
    services: Service[];
    clients: string[];
    recent: Appointment[];
    revenue: number;
    completedCount: number;
    kpis: Kpi[];
    revenueChartModel: RevenueChartModel;
};

export function DashboardContent(props: DashboardContentProps) {
    switch (props.view) {
        case "dashboard":
            return (
                <DashboardOverview
                    appointments={props.appointments}
                    services={props.services}
                    recent={props.recent}
                    revenue={props.revenue}
                    completedCount={props.completedCount}
                />
            );

        case "agenda":
        case "catalogo":
        case "novo-servico":
        case "profissionais":
        case "metricas":
        case "configuracoes":
            return <ReferencePanels view={props.view} />;

        case "clientes":
            return <ClientsPanel clients={props.clients} />;

        default:
            return <ReferencePanels view="configuracoes" />;
    }
}
