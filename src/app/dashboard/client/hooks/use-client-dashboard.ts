import { useEffect, useMemo } from "react";
import { clientNav, resolveClientView } from "../client.nav";
import { getUpcomingAppointments } from "../client-dashboard.utils";
import { useClientDashboardStore } from "../stores/client-dashboard.store";

export function useClientDashboard(rawView?: string) {
  const view = resolveClientView(rawView);
  const active =
    clientNav.find((item) => item.href.endsWith(`view=${view}`))?.label ??
    "Início";
  const data = useClientDashboardStore((state) => state.data);
  const loading = useClientDashboardStore((state) => state.loading);
  const error = useClientDashboardStore((state) => state.error);
  const load = useClientDashboardStore((state) => state.load);
  const refresh = useClientDashboardStore((state) => state.refresh);

  useEffect(() => {
    load();
  }, [load]);

  const upcoming = useMemo(
    () => (data ? getUpcomingAppointments(data.appointments) : []),
    [data],
  );

  return {
    active,
    data,
    error,
    loading,
    refresh,
    reloadPage: () => window.location.reload(),
    upcoming,
    view,
  };
}
