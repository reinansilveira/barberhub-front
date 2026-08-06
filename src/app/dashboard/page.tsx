import { redirect } from "next/navigation";
import "./page.scss";
import { getSessionRole } from "./dashboard.service";
import { OwnerDashboard } from "./owner/OwnerDashboard";
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const role = await getSessionRole();
  if (!role) redirect("/login");

  const view = (await searchParams).view;

  switch (role) {
    case "owner":
      return <OwnerDashboard view={view} />;
    // case "professional":
    //   return <ProfessionalDashboard view={view} />;
    // case "client":
    //   return <ClientDashboard view={view} />;
    default:
      redirect("/login");
  }
}
