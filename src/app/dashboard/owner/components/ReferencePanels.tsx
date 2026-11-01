"use client";

import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { RevenueChartModel } from "../revenue-chart.utils";
import { useReferencePanels } from "../hooks/use-reference-panels";
import type { OwnerView, Payment } from "../owner.types";
import { CalendarReferencePanel } from "./CalendarReferencePanel";
import { FinancialReferencePanel } from "./FinancialReferencePanel";
import { ProfessionalsReferencePanel } from "./ProfessionalsReferencePanel";
import type { ProfileSettingsData } from "./ProfileSettingsPanel";
import { ServicesReferencePanel } from "./ServicesReferencePanel";
import { SettingsReferencePanel } from "./SettingsReferencePanel";

type ReferencePanelsProps = {
  view: OwnerView;
  revenueChartModel: RevenueChartModel;
  profile: ProfileSettingsData;
  services: Service[];
  appointments: Appointment[];
  payments: Payment[];
};

export const ReferencePanels = ({
  view,
  revenueChartModel,
  profile,
  services,
  appointments,
  payments,
}: ReferencePanelsProps) => {
  const model = useReferencePanels({
    view,
    services,
    appointments,
    payments,
  });

  if (view === "agenda") {
    return (
      <CalendarReferencePanel
        appointments={appointments}
        calendar={model.calendar}
      />
    );
  }

  if (view === "profissionais") {
    return (
      <ProfessionalsReferencePanel
        appointments={appointments}
        panel={model.professionals}
        editError={model.editError}
        savingEdit={model.savingEdit}
      />
    );
  }

  if (view === "catalogo" || view === "novo-servico") {
    return (
      <ServicesReferencePanel
        appointments={appointments}
        services={services}
        panel={model.services}
        editError={model.editError}
        savingEdit={model.savingEdit}
      />
    );
  }

  if (view === "metricas") {
    return (
      <FinancialReferencePanel
        appointments={appointments}
        payments={payments}
        revenueChartModel={revenueChartModel}
        financial={model.financial}
      />
    );
  }

  return (
    <SettingsReferencePanel
      profile={profile}
      appointments={appointments}
      payments={payments}
    />
  );
};
