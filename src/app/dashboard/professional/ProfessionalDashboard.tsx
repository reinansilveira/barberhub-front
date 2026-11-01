import { CalendarDays, Scissors, Star, TrendingUp } from "lucide-react";
import { DashboardSidebar } from "../_shared/components/DashboardSidebar";
import { professionalNav } from "./professional.nav";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { currency, initials, timeText } from "../_shared/dashboard.utils";
import {
  isActiveAppointment,
  longDateText,
  professionalStatusLabel,
} from "./professional-dashboard.utils";
import {
  getProfessionalDashboardData,
  type ProfessionalDashboardAppointment,
  type ProfessionalDashboardData,
} from "./professional.service";

function Agenda({
  appointments,
  heading,
  description,
}: {
  appointments: ProfessionalDashboardAppointment[];
  heading: string;
  description: string;
}) {
  return (
    <section className="member-card pro-agenda">
      <div className="member-card__heading">
        <div>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
      </div>
      {appointments.length === 0 ? (
        <p className="empty">Nenhum agendamento encontrado.</p>
      ) : (
        appointments.map((appointment) => {
          const scheduledAt = new Date(appointment.scheduledAt);
          return (
            <article className="pro-agenda__row" key={appointment.id}>
              <b>
                {timeText.format(scheduledAt)}
                <small>{scheduledAt.toLocaleDateString("pt-BR")}</small>
              </b>
              <span className="pro-agenda__line" aria-hidden="true" />
              <i aria-hidden="true">{initials(appointment.client.name)}</i>
              <div>
                <h3>{appointment.client.name}</h3>
                <p>{appointment.service.name}</p>
              </div>
              <strong>{currency.format(appointment.price)}</strong>
              <span className="member-status">
                {professionalStatusLabel(appointment.status)}
              </span>
            </article>
          );
        })
      )}
    </section>
  );
}

function Account({ data }: { data: ProfessionalDashboardData }) {
  const { profile, earnings, appointments } = data;

  return (
    <div className="professional-account">
      <section className="professional-account__summary">
        <Avatar className="member-topbar__avatar">
          <AvatarImage src={profile.avatar ?? undefined} alt={profile.name} />
          <AvatarFallback>{initials(profile.name)}</AvatarFallback>
        </Avatar>
        <h2>{profile.name}</h2>
        <p>{profile.specialty || "Especialidade não informada"}</p>
        <span className="professional-account__badge">
          <Star aria-hidden="true" />
          {profile.totalReviews
            ? `${profile.rating.toLocaleString("pt-BR", {
                maximumFractionDigits: 1,
              })} · ${profile.totalReviews} avaliação(ões)`
            : "Ainda sem avaliações"}
        </span>
        <div>
          <span>
            <strong>{appointments.length}</strong>
            Atendimentos
          </span>
          <span>
            <strong>{earnings.completedAppointments}</strong>
            Concluídos
          </span>
          <span>
            <strong>{currency.format(earnings.grossRevenue)}</strong>
            Faturamento
          </span>
        </div>
      </section>

      <div className="professional-account__details">
        <section className="member-card member-list">
          <div className="member-card__heading">
            <div>
              <h2>Perfil profissional</h2>
              <p>Dados cadastrados para sua atuação.</p>
            </div>
          </div>
          <article className="member-list__row">
            <Scissors aria-hidden="true" />
            <div>
              <h3>Especialidade</h3>
              <p>{profile.specialty || "Não informada"}</p>
            </div>
          </article>
          <article className="member-list__row">
            <CalendarDays aria-hidden="true" />
            <div>
              <h3>Experiência</h3>
              <p>
                {profile.experience === null
                  ? "Não informada"
                  : `${profile.experience} ano(s) de experiência`}
              </p>
            </div>
          </article>
          {profile.bio && (
            <article className="member-list__row">
              <div>
                <h3>Sobre mim</h3>
                <p>{profile.bio}</p>
              </div>
            </article>
          )}
        </section>
      </div>

      <aside className="professional-account__aside">
        <section className="member-card professional-account__availability">
          <div className="member-card__heading">
            <div>
              <h2>Resumo financeiro</h2>
              <p>Valores baseados em atendimentos concluídos.</p>
            </div>
          </div>
          <div>
            <span>Comissão</span>
            <b>{earnings.commissionRate.toLocaleString("pt-BR")}%</b>
          </div>
          <div>
            <span>Ticket médio</span>
            <b>{currency.format(earnings.averageTicket)}</b>
          </div>
          <div>
            <span>Ganhos estimados</span>
            <b>{currency.format(earnings.estimatedEarnings)}</b>
          </div>
        </section>
      </aside>
    </div>
  );
}

export async function ProfessionalDashboard({
  view: rawView,
}: {
  view?: string;
}) {
  const requestedView = rawView ?? "inicio";
  const view = professionalNav.some((item) =>
    item.href.endsWith(`view=${requestedView}`),
  )
    ? requestedView
    : "inicio";
  const active =
    professionalNav.find((item) => item.href.endsWith(`view=${view}`))?.label ??
    "Início";
  let data: ProfessionalDashboardData | null = null;
  let error = "";

  try {
    data = await getProfessionalDashboardData();
  } catch {
    error = "Não foi possível carregar os dados do profissional.";
  }

  const upcomingAppointments = data
    ? data.appointments
        .filter(isActiveAppointment)
        .sort(
          (first, second) =>
            new Date(first.scheduledAt).getTime() -
            new Date(second.scheduledAt).getTime(),
        )
    : [];
  const agenda = (
    <Agenda
      appointments={upcomingAppointments}
      heading="Minha agenda"
      description={longDateText.format(new Date())}
    />
  );
  const content = !data ? (
    <section className="member-card member-state">
      <h2>Não foi possível carregar</h2>
      <p>{error}</p>
    </section>
  ) : view === "agenda" ? (
    agenda
  ) : view === "ganhos" ? (
    <div className="pro-earnings">
      <section className="member-hero">
        <div>
          <p>Ganhos estimados acumulados</p>
          <h2>{currency.format(data.earnings.estimatedEarnings)}</h2>
          <span>
            <TrendingUp aria-hidden="true" />
            Comissão de {data.earnings.commissionRate.toLocaleString("pt-BR")}%
          </span>
        </div>
      </section>
      <section className="member-stat-grid">
        <article>
          <small>Atendimentos concluídos</small>
          <b>{data.earnings.completedAppointments}</b>
        </article>
        <article>
          <small>Faturamento bruto</small>
          <b>{currency.format(data.earnings.grossRevenue)}</b>
        </article>
        <article>
          <small>Ticket médio</small>
          <b>{currency.format(data.earnings.averageTicket)}</b>
        </article>
      </section>
      {agenda}
    </div>
  ) : view === "servicos" ? (
    <section className="member-card member-list">
      <div className="member-card__heading">
        <div>
          <h2>Meus serviços</h2>
          <p>Serviços vinculados ao seu perfil profissional.</p>
        </div>
      </div>
      {data.services.length === 0 ? (
        <p className="empty">Nenhum serviço vinculado ao seu perfil.</p>
      ) : (
        data.services.map((professionalService) => (
          <article
            className="member-list__row"
            key={professionalService.service.id}
          >
            <Scissors aria-hidden="true" />
            <div>
              <h3>{professionalService.service.name}</h3>
              <p>
                {professionalService.effectiveDuration} min ·{" "}
                {professionalService.active ? "Ativo" : "Inativo"}
              </p>
            </div>
            <strong>
              {currency.format(professionalService.effectivePrice)}
            </strong>
          </article>
        ))
      )}
    </section>
  ) : view === "conta" ? (
    <Account data={data} />
  ) : (
    <div className="member-home">
      <section className="member-card member-welcome">
        <CalendarDays aria-hidden="true" />
        <div>
          <h2>Olá, {data.profile.name}</h2>
          <p>
            {upcomingAppointments.length
              ? `Você tem ${upcomingAppointments.length} agendamento(s) em aberto.`
              : "Você não tem agendamentos em aberto."}
          </p>
        </div>
      </section>
      <section className="member-stat-grid">
        <article>
          <small>Próximos horários</small>
          <b>{upcomingAppointments.length}</b>
        </article>
        <article>
          <small>Atendimentos concluídos</small>
          <b>{data.earnings.completedAppointments}</b>
        </article>
        <article>
          <small>Ganhos estimados</small>
          <b>{currency.format(data.earnings.estimatedEarnings)}</b>
        </article>
      </section>
      {agenda}
    </div>
  );

  return (
    <section className="dashboard-shell member-dashboard professional-dashboard">
      <DashboardSidebar active={active} items={professionalNav} />
      <div className="dashboard-shell__main">
        <header className="member-topbar dashboard-shell__topbar">
          <div className="member-topbar__container">
            <div>
              <h1>{active}</h1>
              <p>Acompanhe sua rotina e seus resultados.</p>
            </div>
            <div className="member-topbar__profile">
              <a
                className="member-topbar__account"
                href="/dashboard?view=conta"
                aria-label="Abrir meu perfil"
              >
                <span>{data?.profile.name ?? "Conta profissional"}</span>
                <Avatar className="member-topbar__avatar">
                  <AvatarImage
                    src={data?.profile.avatar ?? undefined}
                    alt={data?.profile.name ?? "Conta profissional"}
                  />
                  <AvatarFallback>
                    {data ? initials(data.profile.name) : "—"}
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
      </div>
    </section>
  );
}
