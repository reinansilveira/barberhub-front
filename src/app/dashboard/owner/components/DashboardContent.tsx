"use client";

import { useState } from "react";
import { DashboardOverview } from "./DashboardOverview";
import { ReferencePanels } from "./ReferencePanels";
import { ClientsPanel } from "./ClientsPanel";
import { NewAppointmentModal } from "./NewAppointmentModal";
import { NewServiceModal } from "./NewServiceModal";
import { NewBarberModal } from "./NewBarberModal";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { CurrentUser, DashboardOverviewStats, Kpi, OwnerView } from "../owner.types";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";

type DashboardContentProps = {
    view: OwnerView;
    appointments: Appointment[];
    services: Service[];
    clients: string[];
    recent: Appointment[];
    revenue: number;
    completedCount: number;
    dashboardStats: DashboardOverviewStats;
    userName: string;
    kpis: Kpi[];
    revenueChartModel: RevenueChartModel;
    profile: CurrentUser;
};

export function DashboardContent(props: DashboardContentProps) {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
    const openAppointmentModal = () => setIsAppointmentModalOpen(true);
    const closeAppointmentModal = () => setIsAppointmentModalOpen(false);

    const content = (() => {
    switch (props.view) {
        case "dashboard":
            return (
                <DashboardOverview
                    appointments={props.appointments}
                    services={props.services}
                    recent={props.recent}
                    revenue={props.revenue}
                    completedCount={props.completedCount}
                    dashboardStats={props.dashboardStats}
                    userName={props.userName}
                    onNewAppointment={openAppointmentModal}
                    revenueChartModel={props.revenueChartModel}
                  />
            );

        case "agenda":
        case "catalogo":
        case "novo-servico":
        case "profissionais":
        case "metricas":
        case "configuracoes":
            return <ReferencePanels view={props.view} onNewAppointment={openAppointmentModal} onNewService={() => setIsServiceModalOpen(true)} onNewBarber={() => setIsBarberModalOpen(true)} revenueChartModel={props.revenueChartModel} profile={props.profile} services={props.services} />;

        case "clientes":
            return <ClientsPanel clients={props.clients} />;

        default:
            return <ReferencePanels view="configuracoes" onNewAppointment={openAppointmentModal} revenueChartModel={props.revenueChartModel} profile={props.profile} services={props.services} />;
    }
    })();

    return (
        <>
            {content}
            <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={closeAppointmentModal}
                services={props.services}
                appointments={props.appointments}
            />
            <NewServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} />
            <NewBarberModal isOpen={isBarberModalOpen} onClose={() => setIsBarberModalOpen(false)} />
        </>
    );
}
