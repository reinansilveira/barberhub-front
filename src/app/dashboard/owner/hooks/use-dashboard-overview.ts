import { useMemo, useState } from "react";
import type { Appointment } from "@/services/appointment";
import { useOpenDashboardModal } from "../../_shared/stores/dashboard-modals.store";
import {
  buildRevenueTotals,
  buildServiceMix,
  buildTeamPerformance,
  getGreeting,
  getUpcomingAppointments,
  sumPaidPayments,
  type RevenuePeriod,
} from "../dashboard-overview.utils";
import type { Payment } from "../owner.types";

export const useDashboardOverview = ({
  appointments,
  recent,
  payments,
}: {
  appointments: Appointment[];
  recent: Appointment[];
  payments: Payment[];
}) => {
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("week");
  const openModal = useOpenDashboardModal();

  const overview = useMemo(() => {
    const now = new Date();
    return {
      now,
      revenueTotals: buildRevenueTotals(payments, now),
      walletBalance: sumPaidPayments(payments),
      teamPerformance: buildTeamPerformance(appointments),
      serviceMix: buildServiceMix(appointments),
      upcoming: getUpcomingAppointments(appointments, now),
    };
  }, [appointments, payments]);

  return {
    ...overview,
    greeting: getGreeting(overview.now),
    revenuePeriod,
    setRevenuePeriod,
    recentAppointments: recent.slice(0, 5),
    openNewAppointment: () => openModal("appointment"),
  };
};
