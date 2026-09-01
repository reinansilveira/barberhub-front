import { Download, Plus } from "lucide-react";

type DashboardGreetingActionsProps = {
  exportLabel: string;
  appointmentLabel: string;
  appointmentHref?: string;
  onExport?: () => void;
};

export function DashboardGreetingActions({
  exportLabel,
  appointmentLabel,
  appointmentHref = "/dashboard?view=agenda",
  onExport,
}: DashboardGreetingActionsProps) {
  return (
    <div className="dashboardGreetingActions">
      <button type="button" onClick={onExport}>
        <Download aria-hidden="true" />
        {exportLabel}
      </button>
      <a href={appointmentHref}>
        <Plus aria-hidden="true" />
        {appointmentLabel}
      </a>
    </div>
  );
}
