"use client";

import { CalendarDays, LoaderCircle, Plus } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { DashboardSidebar } from "../_shared/components/DashboardSidebar";
import { initials } from "../_shared/dashboard.utils";
import { clientNav } from "./client.nav";
import { ClientAccount } from "./components/ClientAccount";
import { ClientAppointmentsList } from "./components/ClientAppointmentsList";
import { ClientBookingModal } from "./components/ClientBookingModal";
import { ClientNotificationPopover } from "./components/ClientNotificationPopover";
import { useClientBookingModal } from "./hooks/use-client-booking-modal";
import { useClientDashboard } from "./hooks/use-client-dashboard";

export function ClientDashboard({ view }: { view?: string }) {
  const dashboard = useClientDashboard(view);
  const bookingModal = useClientBookingModal();

  let content;
  if (dashboard.loading) {
    content = (
      <section className="member-card member-state">
        <LoaderCircle className="member-state__spinner" aria-hidden="true" />
        <h2>Carregando sua conta</h2>
      </section>
    );
  } else if (dashboard.error || !dashboard.data) {
    content = (
      <section className="member-card member-state">
        <h2>Não foi possível carregar</h2>
        <p>{dashboard.error}</p>
        <button type="button" onClick={dashboard.reloadPage}>
          Tentar novamente
        </button>
      </section>
    );
  } else if (dashboard.view === "agendamentos") {
    content = <ClientAppointmentsList />;
  } else if (dashboard.view === "inicio") {
    content = (
      <>
        <section className="member-card member-welcome">
          <CalendarDays aria-hidden="true" />
          <div>
            <h2>Olá, {dashboard.data.client.name}</h2>
            <p>
              {dashboard.upcoming.length
                ? `Você tem ${dashboard.upcoming.length} agendamento(s) futuro(s).`
                : "Você não tem agendamentos futuros."}
            </p>
          </div>
        </section>
        <ClientAccount />
      </>
    );
  } else {
    content = <ClientAccount />;
  }

  return (
    <section className="dashboard-shell member-dashboard">
      <DashboardSidebar active={dashboard.active} items={clientNav} />
      <div className="dashboard-shell__main">
        <header className="member-topbar dashboard-shell__topbar">
          <div className="member-topbar__container">
            <div>
              <h1>{dashboard.active}</h1>
              <p>Gerencie seus dados, preferências e histórico</p>
            </div>
            <div className="member-topbar__profile">
              <button
                className="member-button member-button--dark member-topbar__booking"
                type="button"
                aria-label="Novo agendamento"
                onClick={bookingModal.openBooking}
              >
                <Plus aria-hidden="true" />
                <span>Novo agendamento</span>
              </button>
              <ClientNotificationPopover />
              <a
                className="member-topbar__account"
                href="/dashboard?view=conta"
                aria-label="Abrir minha conta"
              >
                <span>{dashboard.data?.client.name ?? "Conta do cliente"}</span>
                <Avatar className="member-topbar__avatar">
                  <AvatarImage
                    src={dashboard.data?.client.avatar ?? undefined}
                    alt={dashboard.data?.client.name ?? "Conta do cliente"}
                  />
                  <AvatarFallback>
                    {dashboard.data
                      ? initials(dashboard.data.client.name)
                      : "—"}
                  </AvatarFallback>
                  <AvatarBadge />
                </Avatar>
              </a>
            </div>
          </div>
        </header>
        <div className="dashboard-shell__content">
          <div className="member-dashboard__content">{content}</div>
        </div>
        {dashboard.data && (
          <ClientBookingModal
            clientId={dashboard.data.client.id}
            onCreated={dashboard.refresh}
          />
        )}
      </div>
    </section>
  );
}
