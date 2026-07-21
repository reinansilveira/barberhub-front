import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverApi } from "@/services/api/server";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import styles from "@/features/app/AppPage.module.scss";

export default async function DashboardPage() {
  if (!(await cookies()).get("barberhub_access_token")) redirect("/login");
  let appointments: Appointment[] = []; let services: Service[] = []; let unavailable = false;
  try { [appointments, services] = await Promise.all([serverApi<Appointment[]>({ url: "/appointments" }), serverApi<Service[]>({ url: "/services" })]); } catch { unavailable = true; }
  return <main className={styles.page}><section className={styles.wide}><span className={styles.eyebrow}>Painel</span><h1>Visão geral</h1>{unavailable ? <p className={styles.error}>Não foi possível carregar os dados da API.</p> : <><div className={styles.metrics}><div><b>{appointments.length}</b><span>Agendamentos</span></div><div><b>{services.length}</b><span>Serviços ativos</span></div><div><b>{appointments.filter((item) => item.status === "PENDING").length}</b><span>Pendentes</span></div></div><h2>Próximos agendamentos</h2><div className={styles.table}>{appointments.slice(0, 8).map((item) => <article key={item.id}><strong>{item.client.name}</strong><span>{item.service.name} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.scheduledAt))}</span><em>{item.status}</em></article>)}{!appointments.length && <p>Nenhum agendamento encontrado.</p>}</div></>}</section></main>;
}
