"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck2,
  CalendarX2,
  CalendarDays,
  BarChart3,
  Bell,
  Building2,
  Clock3,
  CreditCard,
  Grid2X2,
  MoreHorizontal,
  Pencil,
  List,
  Plus,
  Scissors,
  Sparkles,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Square,
  UsersRound,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { OwnerView } from "../owner.types";
import { findAllProfessionals, updateProfessional, type ProfessionalResponseDto } from "@/services/professional";
import { updateService, type Service } from "@/services/service";
import { apiErrorMessage } from "@/services/api/api-error";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Rating } from "@/components/reui/rating";
import { RevenueLineChart } from "@/components/shadcn/RevenueLineChart";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";
import { ProfileSettingsPanel, type ProfileSettingsData } from "./ProfileSettingsPanel";

type MetricIconName = "calendar" | "pending" | "cancelled" | "wallet" | "scissors" | "star" | "users";
const metricIconNames: MetricIconName[] = ["calendar", "pending", "cancelled", "wallet", "scissors", "star", "users"];

const barbers = ["Enzo Ribeiro", "Mateo Silva", "Lucas Mendes"];
const barberAvatars = ["https://i.pravatar.cc/96?img=12", "https://i.pravatar.cc/96?img=33", "https://i.pravatar.cc/96?img=68"];
const barberProfiles = [
  { role: "Barbeiro sênior", rating: "4,9", cuts: "142", revenue: "R$ 3,2k", retention: "98%", progress: "6 / 8 agendamentos", stripe: "green" },
  { role: "Barbeiro pleno", rating: "4,7", cuts: "118", revenue: "R$ 2,7k", retention: "94%", progress: "5 / 7 agendamentos", stripe: "yellow" },
  { role: "Barbeiro júnior", rating: "4,6", cuts: "97", revenue: "R$ 2,1k", retention: "89%", progress: "4 / 6 agendamentos", stripe: "violet" },
];
const services = [
  ["Corte Masculino", "Corte tradicional", "142", "R$ 50", "98%", "#00c982"],
  ["Barba Completa", "Barba e acabamento", "86", "R$ 35", "95%", "#ffa116"],
  ["Corte + Barba", "O combo especial", "112", "R$ 75", "99%", "#8c2dff"],
];
const serviceProfiles = [
  { duration: "30 min", rating: "4,9", icon: "scissors" },
  { duration: "25 min", rating: "4,8", icon: "square" },
  { duration: "60 min", rating: "5,0", icon: "sparkles" },
];
const calendarPeriods = [
  "18–24 de novembro de 2024",
  "25 de novembro–1º de dezembro de 2024",
  "2–8 de dezembro de 2024",
];
const calendarDays = [
  { label: "SEG", date: "18", events: [[1, "Corte Clássico", "Diego · Enzo", "mint"], [3, "Barba", "Lucas · Mateo", "yellow"], [5, "Combo Completo", "Gabriel · Lucas", "violet"], [7, "Corte Kids", "Thiago · Enzo", "mint"]] },
  { label: "TER", date: "19", events: [[2, "Fade + Barba", "Rafael · Mateo", "yellow"], [3, "Corte Clássico", "Antônio · Lucas", "violet"], [6, "Corte Real", "Pedro · Enzo", "mint"]] },
  { label: "QUA", date: "20", current: true, events: [[1, "Combo Completo", "Lucas · Enzo", "mint"], [2, "Corte Clássico", "Marcus · Mateo", "yellow"], [4, "Barba", "Bruno · Lucas", "violet"], [6, "Corte Kids", "Victor · Enzo", "mint"], [8, "Fade + Barba", "Kaique · Mateo", "yellow"]] },
  { label: "QUI", date: "21", events: [[2, "Corte Clássico", "João · Lucas", "violet"], [3, "Combo Completo", "Lucas · Enzo", "mint"], [4, "Barba", "Felipe · Enzo", "mint"], [6, "Combo Completo", "Caio · Mateo", "yellow"], [8, "Corte Kids", "Ravi · Lucas", "violet"]] },
  { label: "SEX", date: "22", events: [[1, "Corte Clássico", "Henrique · Enzo", "mint"], [3, "Barba", "Luiz · Mateo", "yellow"], [5, "Combo Completo", "Otávio · Lucas", "violet"], [6, "Fade + Barba", "Yuri · Enzo", "mint"]] },
  { label: "SÁB", date: "23", events: [[1, "Corte Kids", "Samuel · Mateo", "yellow"], [2, "Corte Clássico", "Igor · Lucas", "violet"], [5, "Corte Real", "Tiago · Lucas", "violet"]] },
  { label: "DOM", date: "24", events: [[3, "Combo Completo", "Fábio · Enzo", "mint"], [5, "Barba", "Alex · Mateo", "yellow"]] },
];
const dailySchedule = [
  ["8:00", "45 min", "Lucas Ferreira", "Combo Completo", "Enzo", "R$ 130", "Concluído"],
  ["9:00", "30 min", "Marcos Rocha", "Corte Clássico", "Mateo", "R$ 85", "Concluído"],
  ["11:00", "45 min", "Bruno Alves", "Barba", "Lucas", "R$ 70", "Agora"],
  ["1:00", "30 min", "Victor Lima", "Corte Kids", "Enzo", "R$ 60", "Próximo"],
  ["2:30", "60 min", "Kaique Nunes", "Fade + Barba", "Mateo", "R$ 110", "Próximo"],
];
const openSlots = [
  ["12:00", "Enzo"],
  ["14:00", "Lucas"],
  ["16:00", "Mateo"],
  ["17:00", "Enzo"],
];
const recentCancellations = [
  ["Rafael Santos", "Fade + Barba", "14:45", "RS"],
  ["André Souza", "Corte Clássico", "15:00", "AS"],
  ["Felipe Castro", "Combo Completo", "16:30", "FC"],
];

function PageHead({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <header className="pageHead dashboard-page__header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <button className="blackAction dashboard-action-button" type="button" onClick={onAction}>{action.startsWith("+") && <Plus aria-hidden="true" />} {action.replace(/^\+\s*/, "")}</button>}
    </header>
  );
}
function MetricIcon({ name }: { name: MetricIconName }) {
  const icons = {
    calendar: CalendarCheck2,
    pending: Clock3,
    cancelled: CalendarX2,
    wallet: WalletCards,
    scissors: Scissors,
    star: Star,
    users: UsersRound,
  } as const;
  const Icon = icons[name];
  return <Icon aria-hidden="true" />;
}
function ServiceIcon({ name }: { name: string }) {
  const icons = { scissors: Scissors, square: Square, sparkles: Sparkles } as const;
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;
  return <Icon aria-hidden="true" />;
}
function SettingsIcon({ item }: { item: string }) {
  const icons = { Profile: UserRound, Business: Building2, Notifications: Bell, Security: ShieldCheck, Billing: CreditCard } as const;
  const Icon = icons[item as keyof typeof icons] ?? UserRound;
  return <Icon aria-hidden="true" />;
}
function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === "left" ? (
        <>
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}
function MiniStats({
  items,
  className = "",
}: {
  items: Array<[MetricIconName | string, string, string, string]>;
  className?: string;
}) {
  return (
    <section className={`miniStats ${className}`}>
      {items.map(([icon, title, value, trend]) => (
        <article key={title}>
          <i className={`miniStats__icon miniStats__icon--${icon}`}>
            {metricIconNames.includes(icon as MetricIconName) ? (
              <MetricIcon name={icon as MetricIconName} />
            ) : icon}
          </i>
          <div>
            <small>{title}</small>
            <strong>{value}</strong>
          </div>
          <em>{trend}</em>
        </article>
      ))}
    </section>
  );
}
function PerformanceMetrics({ name, kind, model }: { name: string; kind: "barber" | "service"; model: RevenueChartModel }) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const isBarber = kind === "barber";
  const periodNames = { week: "semanal", month: "mensal", year: "anual" } as const;
  const periodTotals = { week: 9970, month: 32900, year: 226100 } as const;
  return (
    <div className="metrics-view__content">
      <div className="metrics-view__heading">
        <div><span>{isBarber ? "Desempenho do barbeiro" : "Desempenho do serviço"}</span><h2>{name}</h2><p>Visão geral dos resultados no período selecionado.</p></div>
      </div>
      <MiniStats items={isBarber ? [["calendar", "Cortes realizados", "142", "+12,5%"], ["wallet", "Receita gerada", "R$ 3,2k", "+8,4%"], ["users", "Retenção", "98%", "+4,2%"], ["star", "Avaliação", "4,9", "+0,3"]] : [["calendar", "Agendamentos", "142", "+12,5%"], ["wallet", "Receita", "R$ 7.100", "+8,4%"], ["star", "Satisfação", "98%", "+4,2%"], ["pending", "Duração média", "30 min", "-2,1%"]]} />
      <section className="referencePanel revenueOverview metrics-view__chart">
        <div className="metrics-view__chart-head"><div><h2>Receita {periodNames[period]}</h2><strong>R$ {periodTotals[period].toLocaleString("pt-BR")} <span>↗ +12,5%</span></strong></div><div className="metrics-view__periods" role="group" aria-label="Período da receita">{(["week", "month", "year"] as const).map((item) => <button type="button" className={period === item ? "is-active" : ""} aria-pressed={period === item} onClick={() => setPeriod(item)} key={item}>{item === "week" ? "Semana" : item === "month" ? "Mês" : "Ano"}</button>)}</div></div>
        <RevenueLineChart model={model} period={period} />
      </section>
    </div>
  );
}

export function ReferencePanels({
  view,
  onNewAppointment,
  onNewService,
  onNewBarber,
  revenueChartModel,
  profile,
  services: dashboardServices,
}: {
  view: OwnerView;
  onNewAppointment?: () => void;
  onNewService?: () => void;
  onNewBarber?: () => void;
  revenueChartModel: RevenueChartModel;
  profile: ProfileSettingsData;
  services: Service[];
}) {
  const router = useRouter();
  const [calendarFilter, setCalendarFilter] = useState<"day" | "week" | "month">("month");
  const [calendarPeriod, setCalendarPeriod] = useState(0);
  const [selectedDate, setSelectedDate] = useState(20);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [barberAction, setBarberAction] = useState<"edit" | "metrics" | null>(null);
  const [openBarberMenu, setOpenBarberMenu] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceAction, setServiceAction] = useState<"edit" | "metrics" | null>(null);
  const [openServiceMenu, setOpenServiceMenu] = useState<string | null>(null);
  const [financialPeriod, setFinancialPeriod] = useState<"week" | "month" | "year">("week");
  const [professionals, setProfessionals] = useState<ProfessionalResponseDto[]>([]);
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [serviceEdit, setServiceEdit] = useState({ name: "", price: "", duration: "", description: "", category: "" });
  const [professionalEdit, setProfessionalEdit] = useState({ specialty: "", experience: "", commission: "", bio: "" });

  useEffect(() => {
    if (view === "profissionais") {
      findAllProfessionals(true).then(setProfessionals).catch(() => setProfessionals([]));
    }
  }, [view]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelectedBarber(null);
      setSelectedService(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const openServiceEdit = (name: string) => {
    const service = dashboardServices.find((item) => item.name === name);
    setEditError("");
    setServiceEdit({ name: service?.name || name, price: String(service?.price ?? ""), duration: String(service?.duration ?? ""), description: service?.description || "", category: service?.category || "" });
    setSelectedService(name);
    setServiceAction("edit");
  };
  const openProfessionalEdit = (name: string) => {
    const professional = professionals.find((item) => item.user.name === name);
    setEditError("");
    setProfessionalEdit({ specialty: professional?.specialty || "", experience: String(professional?.experience ?? ""), commission: String(professional?.commission ?? ""), bio: professional?.bio || "" });
    setSelectedBarber(name);
    setBarberAction("edit");
  };
  const monthCells = [
    27, 28, 29, 30, 31,
    ...Array.from({ length: 30 }, (_, index) => index + 1),
  ];

  if (view === "agenda")
    return (
      <div className="referencePage calendarPage calendar-page">
        <header className="pageHead dashboard-page__header calendar-page__header">
          <div>
            <h1>Calendário</h1>
            <p>{calendarPeriods[calendarPeriod]}</p>
          </div>
          <div className="calendar-page__header-actions">
            <button className="calendar-page__icon-button" type="button" aria-label="Filtrar eventos" title="Filtrar eventos">
              <SlidersHorizontal aria-hidden="true" />
            </button>
            <button className="calendar-page__icon-button" type="button" aria-label="Alternar formato de horário" title="Formato de horário">
              <Clock3 aria-hidden="true" />
              <span>24</span>
            </button>
            <div className="calendar-page__filters" aria-label="Visualização do calendário">
              {([
                ["day", "Dia"],
                ["week", "Semana"],
                ["month", "Mês"],
              ] as const).map(([filter, label]) => (
                <button
                  key={filter}
                  className={calendarFilter === filter ? "is-active" : ""}
                  onClick={() => setCalendarFilter(filter)}
                  type="button"
                  aria-pressed={calendarFilter === filter}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="calendar-page__period-actions" aria-label="Navegação do período">
              <button
                className="calendar-page__period-button"
                type="button"
                aria-label="Período anterior"
                onClick={() => setCalendarPeriod((current) => Math.max(0, current - 1))}
              >
                <ArrowIcon direction="left" />
                Anterior
              </button>
              <button
                className="calendar-page__today-button"
                type="button"
                onClick={() => setCalendarPeriod(0)}
              >
                Hoje
              </button>
              <button
                className="calendar-page__period-button"
                type="button"
                aria-label="Próximo período"
                onClick={() => setCalendarPeriod((current) => Math.min(calendarPeriods.length - 1, current + 1))}
              >
                Próximo
                <ArrowIcon direction="right" />
              </button>
            </div>
            <button className="calendar-page__icon-button" type="button" aria-label="Visualização em lista" title="Visualização em lista">
              <List aria-hidden="true" />
            </button>
            <button className="calendar-page__icon-button calendar-page__icon-button--active" type="button" aria-label="Visualização em grade" title="Visualização em grade">
              <Grid2X2 aria-hidden="true" />
            </button>
            <button className="blackAction" type="button" onClick={onNewAppointment}><Plus aria-hidden="true" /> Novo agendamento</button>
          </div>
        </header>
        <MiniStats
          className="calendar-page__stats"
          items={[
            ["calendar", "Esta semana", "42 agendamentos", ""],
            ["pending", "Pendentes", "7 horários", ""],
            ["cancelled", "Cancelados", "3 hoje", ""],
            ["wallet", "Receita", "R$ 8.430", ""],
          ]}
        />
        <section className="calendarGrid">
          <article className="calendarBoard">
            {calendarFilter === "month" ? (
              <div className="calendarMonth calendar-page__month">
                <div className="calendarMonth__weekdays">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="calendarMonth__grid">
                  {monthCells.map((date, index) => {
                    const isOutsideMonth = index < 5;
                    const day = calendarDays.find((item) => item.date === String(date));
                    return (
                      <button className={`calendarMonth__day${date === 20 && !isOutsideMonth ? " is-current" : ""}${isOutsideMonth ? " is-outside" : ""}`} key={`${date}-${index}`} type="button" onClick={() => {
                        if (!isOutsideMonth) {
                          setSelectedDate(date);
                          setCalendarFilter("day");
                        }
                      }}>
                        <b>{date}</b>
                        {day?.events.slice(0, 3).map(([row, title, detail, tone]) => (
                          <span className={`calendarMonth__event calendarMonth__event--${tone}`} key={`${title}-${detail}`}>
                            <strong>{title}</strong>
                            <em>{String(detail).split(" · ")[0]} · {String(7 + Number(row)).padStart(2, "0")}:00</em>
                          </span>
                        ))}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : calendarFilter === "week" ? (
              <div className="calendarWeek calendar-page__week">
                <div className="calendarWeek__grid">
                  {calendarDays.map((day) => (
                    <button className={`calendarWeek__day${day.date === String(selectedDate) ? " is-current" : ""}`} key={day.date} type="button" onClick={() => {
                      setSelectedDate(Number(day.date));
                      setCalendarFilter("day");
                    }}>
                      <header>
                        <small>{day.label}</small>
                        <b>{day.date}</b>
                      </header>
                      <div className="calendarWeek__events">
                        {day.events.map(([row, title, detail, tone]) => (
                          <span className={`calendarWeek__event calendarWeek__event--${tone}`} key={`${title}-${detail}`}>
                            <strong>{title}</strong>
                            <em>{String(detail).split(" · ")[0]} · {String(7 + Number(row)).padStart(2, "0")}:00</em>
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="calendarDayView">
                <div className="calendarDayView__header">
                  <div>
                    <span>Agenda do dia</span>
                    <strong>{selectedDate} de novembro de 2024</strong>
                  </div>
                  <span>{calendarDays.find((day) => day.date === String(selectedDate))?.events.length ?? 0} agendamentos</span>
                </div>
                <div className="calendarDayView__list">
                  {(calendarDays.find((day) => day.date === String(selectedDate))?.events ?? []).map(([row, title, detail, tone]) => (
                    <div className={`calendarDayView__event calendarDayView__event--${tone}`} key={`${title}-${detail}`}>
                      <span className="calendarDayView__time">{`${String(7 + Number(row)).padStart(2, "0")}:00`}</span>
                      <div>
                        <strong>{title}</strong>
                        <span>{String(detail)}</span>
                      </div>
                      <button type="button" onClick={onNewAppointment}>Abrir agenda</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>
        <section className="calendarLower">
          <article className="referencePanel dailySchedule calendar-page__daily-schedule">
            <div className="referencePanelHead">
              <div>
                <h2>Agenda de hoje</h2>
                <p>Qua 20</p>
              </div>
              <span className="calendar-page__schedule-live">● Ao vivo</span>
              <a href="#">Ver todos →</a>
            </div>
            {dailySchedule.map(([time, duration, name, service, barber, price, status], i) => (
              <div className={`scheduleRow calendar-page__schedule-row calendar-page__schedule-row--${i < 2 ? "done" : i === 2 ? "now" : "upcoming"}`} key={name}>
                <strong>{time}<small>{duration}</small></strong>
                <span className="calendar-page__schedule-accent" aria-hidden="true" />
                <i className={`calendar-page__schedule-avatar calendar-page__schedule-avatar--${i + 1}`}>{name.slice(0, 2)}</i>
                <span>
                  <b>{name}</b>
                  <small>{service}</small>
                </span>
                <span className="calendar-page__schedule-barber"><i>{barber.slice(0, 2)}</i>{barber}</span>
                <em>{price}</em>
                <b className={`calendar-page__schedule-status calendar-page__schedule-status--${i < 2 ? "done" : i === 2 ? "now" : "upcoming"}`}>{status}</b>
              </div>
            ))}
          </article>
          <aside className="calendar-page__side-panels">
            <article className="referencePanel openSlots calendar-page__open-slots">
              <h2>Horários disponíveis</h2>
              <p className="calendar-page__side-subtitle">Toque em um horário para agendar</p>
              <div className="calendar-page__slots-list">
                {openSlots.map(([time, barber], i) => (
                  <button className="calendar-page__slot" type="button" key={time}>
                    <span aria-hidden="true">◷</span>
                    <b>{time}</b>
                    <i className={`calendar-page__slot-avatar calendar-page__slot-avatar--${i + 1}`}>{barber.slice(0, 2)}</i>
                    <em>{barber}</em>
                  </button>
                ))}
              </div>
            </article>
            <article className="referencePanel recentCancellations calendar-page__recent-cancellations">
              <h2>Cancelamentos recentes <span>3</span></h2>
              <div className="calendar-page__cancellations-list">
                {recentCancellations.map(([name, service, time, initials], i) => (
                  <div className="calendar-page__cancellation" key={name}>
                    <i className={`calendar-page__cancellation-avatar calendar-page__cancellation-avatar--${i + 1}`}>{initials}</i>
                    <span><b>{name}</b><small>{service} · {time}</small></span>
                    <em>Cancelado</em>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    );

  if (view === "profissionais")
    return (
      <div className="referencePage barbers-page">
        <PageHead
          title="Barbeiros"
          subtitle="Gerencie sua equipe e acompanhe o desempenho"
          action="+ Novo barbeiro"
          onAction={onNewBarber}
        />
        <MiniStats
          items={[
            ["users", "Barbeiros ativos", "3", ""],
            ["calendar", "Agendamentos hoje", "18", ""],
            ["star", "Avaliação média", "4,8", ""],
            ["wallet", "Receita da equipe", "R$ 8,4k", ""],
          ]}
        />
        <section className="barberCards">
          {barbers.map((name, i) => (
            <article className={`barber-card barber-card--${barberProfiles[i].stripe}`} key={name}>
              <span className={`cardStripe stripe${i}`} aria-hidden="true" />
              <header className="barber-card__header">
                <Avatar className="barber-card__avatar">
                  <AvatarImage src={barberAvatars[i]} alt={name} />
                  <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <div>
                  <b>{name}</b>
                  <small>{barberProfiles[i].role}</small>
                  <Rating rating={Number(barberProfiles[i].rating.replace(",", "."))} showValue />
                </div>
                <div className="barber-card__actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Editar ${name}`}
                    onClick={() => { openProfessionalEdit(name); setOpenBarberMenu(null); }}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <div className="barber-card__menu-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Mais opções de ${name}`}
                      aria-expanded={openBarberMenu === name}
                      onClick={() => setOpenBarberMenu(openBarberMenu === name ? null : name)}
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </Button>
                    {openBarberMenu === name && (
                      <div className="barber-card__menu" role="menu">
                        <button type="button" onClick={() => { openProfessionalEdit(name); setOpenBarberMenu(null); }}>Editar perfil</button>
                        <button type="button" onClick={() => { setSelectedBarber(name); setBarberAction("metrics"); setOpenBarberMenu(null); }}>Ver métricas</button>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              <div className="barberNumbers barber-card__metrics">
                <span>
                  <b>{barberProfiles[i].cuts}</b>Cortes/mês
                </span>
                <span>
                  <b>{barberProfiles[i].revenue}</b>Receita
                </span>
                <span>
                  <b>{barberProfiles[i].retention}</b>Retenção
                </span>
              </div>
              <Progress value={[75, 71, 67][i]} className="barber-card__progress">
                <ProgressLabel>Desempenho de hoje</ProgressLabel>
                <ProgressValue>{() => barberProfiles[i].progress}</ProgressValue>
              </Progress>
              <footer className="barber-card__footer">
                <Button type="button" variant="outline" size="sm" onClick={() => onNewAppointment?.()}>
                  <CalendarDays aria-hidden="true" /> Agenda
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedBarber(name); setBarberAction("metrics"); }}>
                  <BarChart3 aria-hidden="true" /> Métricas
                </Button>
              </footer>
            </article>
          ))}
        </section>
        {selectedBarber && (
          <div className={`entity-edit-modal ${barberAction === "metrics" ? "entity-edit-modal--metrics" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedBarber(null); }}>
          <section className={barberAction === "metrics" ? "metrics-view" : "barber-action-panel entity-edit-modal__dialog"} aria-label={`Ação para ${selectedBarber}`} role={barberAction === "edit" ? "dialog" : undefined} aria-modal={barberAction === "edit" ? "true" : undefined}>
            {barberAction === "edit" && <div><span className="barber-action-panel__eyebrow">Editar profissional</span><h2>{selectedBarber}</h2><p>Atualize os dados do profissional e mantenha a equipe organizada.</p></div>}
            {barberAction === "edit" ? (
              <div className="barber-action-panel__form">
                <label>Especialidade<input value={professionalEdit.specialty} onChange={(event) => setProfessionalEdit({ ...professionalEdit, specialty: event.target.value })} placeholder={barberProfiles[barbers.indexOf(selectedBarber)]?.role} /></label>
                <label>Experiência (anos)<input type="number" min="0" value={professionalEdit.experience} onChange={(event) => setProfessionalEdit({ ...professionalEdit, experience: event.target.value })} /></label>
                <label>Comissão (%)<input type="number" min="0" step="0.1" value={professionalEdit.commission} onChange={(event) => setProfessionalEdit({ ...professionalEdit, commission: event.target.value })} /></label>
                <label className="barber-action-panel__field--wide">Bio<textarea rows={2} value={professionalEdit.bio} onChange={(event) => setProfessionalEdit({ ...professionalEdit, bio: event.target.value })} /></label>
                {editError && <p className="barber-action-panel__error" role="alert">{editError}</p>}
                <Button type="button" disabled={savingEdit} onClick={async () => { const professional = professionals.find((item) => item.user.name === selectedBarber); if (!professional) { setEditError("Não foi possível localizar este profissional no backend."); return; } setSavingEdit(true); setEditError(""); try { await updateProfessional(professional.id, { specialty: professionalEdit.specialty || undefined, experience: professionalEdit.experience ? Number(professionalEdit.experience) : undefined, commission: professionalEdit.commission ? Number(professionalEdit.commission) : undefined, bio: professionalEdit.bio || undefined }); setSelectedBarber(null); router.refresh(); } catch (requestError) { setEditError(apiErrorMessage(requestError, "Não foi possível salvar o profissional.")); } finally { setSavingEdit(false); } }}>{savingEdit ? "Salvando..." : "Salvar alterações"}</Button>
              </div>
            ) : <PerformanceMetrics name={selectedBarber} kind="barber" model={revenueChartModel} />}
            <button className={barberAction === "metrics" ? "metrics-view__close" : "barber-action-panel__close"} type="button" aria-label="Fechar painel" onClick={() => setSelectedBarber(null)}>×</button>
          </section>
          </div>
        )}
        <PerformanceTable title="Performance Leaderboard" />
      </div>
    );

  if (view === "catalogo" || view === "novo-servico")
    return (
      <div className="referencePage service-page">
        <PageHead
          title="Serviços"
          subtitle="Gerencie seu catálogo de serviços e preços"
          action="+ Novo serviço"
          onAction={onNewService}
        />
        <MiniStats
          items={[
            ["scissors", "Serviços ativos", "12", "+12,5%"],
            ["calendar", "Agendamentos hoje", "24", "+8,4%"],
            ["pending", "Duração média", "45 min", "-2,1%"],
            ["wallet", "Ticket médio", "R$ 65,00", "+4,2%"],
          ]}
        />
        <section className="serviceCards">
          {services.map(([name, desc, bookings, price, rating], i) => (
            <article className={`service-card service-card--${["green", "yellow", "violet"][i]}`} key={name}>
              <span className="service-card__stripe" aria-hidden="true" />
              <header className="service-card__header">
                <i className="service-card__icon"><ServiceIcon name={serviceProfiles[i].icon} /></i>
                <div>
                  <b>{name}</b>
                  <small>{desc}</small>
                  <em>
                    <Rating rating={Number(serviceProfiles[i].rating.replace(",", "."))} showValue />
                  </em>
                </div>
                <div className="service-card__actions">
                  <Button type="button" variant="outline" size="icon" aria-label={`Editar ${name}`} onClick={() => openServiceEdit(name)}><Pencil aria-hidden="true" /></Button>
                  <div className="service-card__menu-wrap">
                    <Button type="button" variant="outline" size="icon" aria-label={`Mais opções de ${name}`} aria-expanded={openServiceMenu === name} onClick={() => setOpenServiceMenu(openServiceMenu === name ? null : name)}><MoreHorizontal aria-hidden="true" /></Button>
                    {openServiceMenu === name && <div className="service-card__menu" role="menu"><button type="button" onClick={() => { openServiceEdit(name); setOpenServiceMenu(null); }}>Editar serviço</button><button type="button" onClick={() => { setSelectedService(name); setServiceAction("metrics"); setOpenServiceMenu(null); }}>Ver métricas</button></div>}
                  </div>
                </div>
              </header>
              <div className="service-card__metrics">
                <p>
                  <b>{bookings}</b>Agendamentos
                </p>
                <p>
                  <b>{price}</b>Preço
                </p>
                <p>
                  <b>{rating}</b>Satisfação
                </p>
              </div>
              <footer className="service-card__footer">
                <small>Duração: <b>{serviceProfiles[i].duration}</b></small>
                <Button type="button" variant="outline" size="sm" onClick={() => openServiceEdit(name)}>Editar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedService(name); setServiceAction("metrics"); }}>Métricas</Button>
              </footer>
            </article>
          ))}
        </section>
        {selectedService && (
          <div className={`entity-edit-modal ${serviceAction === "metrics" ? "entity-edit-modal--metrics" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedService(null); }}>
          <section className={serviceAction === "metrics" ? "metrics-view" : "service-action-panel entity-edit-modal__dialog"} aria-label={`Ação para ${selectedService}`} role={serviceAction === "edit" ? "dialog" : undefined} aria-modal={serviceAction === "edit" ? "true" : undefined}>
            {serviceAction === "edit" && <div><span>Editar serviço</span><h2>{selectedService}</h2><p>Atualize os dados exibidos no catálogo.</p></div>}
            {serviceAction === "edit" ? <div className="service-action-panel__form"><label>Nome<input value={serviceEdit.name} onChange={(event) => setServiceEdit({ ...serviceEdit, name: event.target.value })} /></label><label>Preço<input inputMode="decimal" value={serviceEdit.price} onChange={(event) => setServiceEdit({ ...serviceEdit, price: event.target.value })} /></label><label>Duração (minutos)<input type="number" min="1" value={serviceEdit.duration} onChange={(event) => setServiceEdit({ ...serviceEdit, duration: event.target.value })} /></label><label>Categoria<input value={serviceEdit.category} onChange={(event) => setServiceEdit({ ...serviceEdit, category: event.target.value })} /></label><label className="service-action-panel__field--wide">Descrição<textarea rows={2} value={serviceEdit.description} onChange={(event) => setServiceEdit({ ...serviceEdit, description: event.target.value })} /></label>{editError && <p className="service-action-panel__error" role="alert">{editError}</p>}<Button type="button" disabled={savingEdit} onClick={async () => { const service = dashboardServices.find((item) => item.name === selectedService); const price = Number(serviceEdit.price.replace(",", ".")); const duration = Number(serviceEdit.duration); if (!service || !service.id) { setEditError("Não foi possível localizar este serviço no backend."); return; } if (!serviceEdit.name.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(duration) || duration < 1) { setEditError("Informe nome, preço e duração válidos."); return; } setSavingEdit(true); setEditError(""); try { await updateService(service.id, { name: serviceEdit.name.trim(), price, duration, description: serviceEdit.description.trim() || undefined, category: serviceEdit.category.trim() || undefined }); setSelectedService(null); router.refresh(); } catch (requestError) { setEditError(apiErrorMessage(requestError, "Não foi possível salvar o serviço.")); } finally { setSavingEdit(false); } }}>{savingEdit ? "Salvando..." : "Salvar alterações"}</Button></div> : <PerformanceMetrics name={selectedService} kind="service" model={revenueChartModel} />}
            <button className={serviceAction === "metrics" ? "metrics-view__close" : "service-action-panel__close"} type="button" aria-label="Fechar painel" onClick={() => setSelectedService(null)}>×</button>
          </section>
          </div>
        )}
        <PerformanceTable title="Service Performance" service />
      </div>
    );

  if (view === "metricas")
    return (
      <div className="referencePage financialPage financial-page">
        <PageHead
          title="Financeiro"
          subtitle="Acompanhe suas receitas, despesas e desempenho"
          action="⇩ Exportar relatório"
        />
        <MiniStats
          items={[
            ["wallet", "Receita total", "R$ 18.540,00", "+12,5%"],
            ["pending", "Ticket médio", "R$ 68,50", "+4,2%"],
            ["calendar", "Agendamentos totais", "284", "-2,1%"],
            ["cancelled", "Despesas", "R$ 4.210,00", "+8,4%"],
          ]}
        />
        <section className="referencePanel revenueOverview financial-page__revenue-overview financial-metrics-card">
          <div className="financial-metrics-card__head">
            <div>
              <h2>Receita {financialPeriod === "week" ? "semanal" : financialPeriod === "month" ? "mensal" : "anual"}</h2>
              <strong>{financialPeriod === "week" ? "R$ 9.970,00" : financialPeriod === "month" ? "R$ 32.900,00" : "R$ 226.100,00"} <span>↗ +12,5%</span></strong>
            </div>
            <div className="financial-metrics-card__periods" role="group" aria-label="Período da receita">
              {(["week", "month", "year"] as const).map((period) => <button type="button" key={period} className={financialPeriod === period ? "is-active" : ""} aria-pressed={financialPeriod === period} onClick={() => setFinancialPeriod(period)}>{period === "week" ? "Semana" : period === "month" ? "Mês" : "Ano"}</button>)}
            </div>
          </div>
          <RevenueLineChart model={revenueChartModel} period={financialPeriod} />
        </section>
        <TransactionTable />
      </div>
    );

  return <SettingsPanel profile={profile} />;
}

function SettingsPanel({ profile }: { profile: ProfileSettingsData }) {
  const [tab, setTab] = useState("Profile");
  const [saved, setSaved] = useState(false);
  const settingsTabs = [
    "Profile",
    "Business",
    "Notifications",
    "Security",
    "Billing",
  ];
  const fields = [
    ["Nome da barbearia", "Vintage Barber Hub"],
    ["Telefone de contato", "+55 (11) 99887-7605"],
    ["Endereço", "Av. Paulista, 1000 - Bela Vista, São Paulo - SP"],
    ["Site", "www.vintagebarber.com.br"],
    ["Moeda", "BRL - R$"],
  ];

  return (
    <div className="referencePage dashboard-page dashboard-page--settings settingsPage settings-page">
      <PageHead
        title="Configurações"
        subtitle="Gerencie as preferências da sua barbearia e da sua conta"
        action=""
      />
      <section className="settingsLayout dashboard-page__content">
        <nav
          className="settingsNav settings-menu"
          aria-label="Seções de configurações"
        >
          {settingsTabs.map((item) => (
            <button
              key={item}
              type="button"
              className={`settings-menu__item ${tab === item ? "settings-menu__item--active active" : ""}`}
              onClick={() => {
                setTab(item);
                setSaved(false);
              }}
            >
              <SettingsIcon item={item} />
              {item === "Profile"
                ? "Perfil"
                : item === "Business"
                  ? "Negócio"
                  : item === "Notifications"
                    ? "Notificações"
                    : item === "Security"
                      ? "Segurança"
                      : "Faturamento"}
            </button>
          ))}
        </nav>
        <div className="dashboard-page__body">
          {tab === "Profile" ? <ProfileSettingsPanel profile={profile} /> : tab === "Business" ? (
            <>
              <section className="referencePanel settings-form">
                <div className="referencePanelHead settings-form__header">
                  <h2 className="settings-form__title">Dados da barbearia</h2>
                  <button
                    type="button"
                    className="blackAction"
                    onClick={() => setSaved(true)}
                  >
                    {saved ? "Alterações salvas ✓" : "Salvar alterações"}
                  </button>
                </div>
                <div className="settings-form__fields">
                  {fields.map(([label, value], index) => (
                    <label
                      className={`settings-form__field ${index === 2 ? "settings-form__field--wide" : ""}`}
                      key={label}
                    >
                      {label}
                      {index === 4 ? (
                        <select className="settings-form__input" defaultValue={value} aria-label={label}>
                          <option>BRL - R$</option>
                          <option>USD - $</option>
                          <option>EUR - €</option>
                        </select>
                      ) : (
                        <input
                          className="settings-form__input"
                          defaultValue={value}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </section>
              <section className="referencePanel hours-form">
                <h2 className="hours-form__title">Horário de funcionamento</h2>
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                  (day, i) => (
                    <div className="hours-form__row" key={day}>
                      <b className="hours-form__day">{day}</b>
                      <button
                        type="button"
                        className={`hours-form__status ${i === 6 ? "hours-form__status--closed" : "hours-form__status--open"}`}
                      >
                        {i === 6 ? "Fechado" : "Aberto"}
                      </button>
                      <input
                        className="hours-form__input"
                        type="time"
                        defaultValue={i === 6 ? "00:00" : "09:00"}
                      />
                      <span className="hours-form__separator">até</span>
                      <input
                        className="hours-form__input"
                        type="time"
                        defaultValue={
                          i === 6 ? "00:00" : i === 5 ? "18:00" : "19:00"
                        }
                      />
                    </div>
                  )
                )}
              </section>
            </>
          ) : (
            <section className="referencePanel settings-empty">
              <h2 className="settings-empty__title">{tab}</h2>
              <p className="settings-empty__description">
                Configure aqui as preferências de {tab.toLowerCase()}.
              </p>
              <button
                type="button"
                className="blackAction"
                onClick={() => setSaved(true)}
              >
                {saved ? "Salvo ✓" : "Salvar alterações"}
              </button>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function PerformanceTable({
  title,
  service = false,
}: {
  title: string;
  service?: boolean;
}) {
  const serviceRows = [services[0], services[2], services[1]];

  return (
    <section className="referencePanel performanceTable">
      <div className="referencePanelHead">
        <h2>{title}</h2>
        <div className="performanceTable__filters">
          <button type="button" className="is-active" aria-pressed="true">Este mês</button>
          <button type="button" aria-pressed="false">Esta semana</button>
        </div>
      </div>
      <div className="performanceHead">
        <span>#</span>
        <span>{service ? "Service" : "Barber"}</span>
        <span>{service ? "Total de agendamentos" : "Agendamentos"}</span>
        <span>Receita</span>
        <span>Ticket médio</span>
        <span>Avaliação</span>
        <span>Status</span>
      </div>
      {[0, 1, 2].map((row) => (
        <div className="performanceRow" key={row}>
          <b>{row + 1}</b>
          <span>
            <i>{service ? <Scissors aria-hidden="true" /> : barbers[row].slice(0, 2)}</i>
            <strong>{service ? serviceRows[row][0] : barbers[row]}</strong>
            <small>{service ? "Mais procurado" : barberProfiles[row].role}</small>
          </span>
          <span>{service ? serviceRows[row][2] : ["142", "118", "97"][row]}</span>
          <span>
            R${" "}
            {service
              ? ["7.100", "8.400", "3.010"][row]
              : ["8.230", "7.270", "6.120"][row]}
          </span>
          <span>{service ? "R$ 52,00" : ["R$ 22,80", "R$ 22,90", "R$ 21,90"][row]}</span>
          <span><Rating rating={Number((service ? "4,9" : ["4,9", "4,7", "4,6"][row]).replace(",", "."))} showValue /></span>
          <em className={row === 2 && !service ? "break" : "active"}>{row === 2 && !service ? "Em pausa" : "Ativo"}</em>
        </div>
      ))}
    </section>
  );
}
function TransactionTable() {
  return (
    <section className="referencePanel transactions financial-page__transactions">
      <div className="referencePanelHead">
        <h2>Transações recentes</h2>
        <a href="#">Ver todas</a>
      </div>
      <div className="transactionTableHead">
        <span>ID da transação</span><span>Data</span><span>Serviço</span><span>Barbeiro</span><span>Valor</span><span>Status</span>
      </div>
      {[
        ["#TRX-9482", "Corte + Barba", "Enzo Ribeiro", "R$ 75,00", "Pago"],
        ["#TRX-9481", "Corte Masculino", "Mateo Silva", "R$ 50,00", "Pago"],
        ["#TRX-9480", "Barba Completa", "Lucas Mendes", "R$ 35,00", "Pendente"],
      ].map((item) => (
        <div className="transactionRow" key={item[0]}>
          <span>{item[0]}</span>
          <span>24 out. 2024</span>
          <b>{item[1]}</b>
          <span>{item[2]}</span>
          <b>{item[3]}</b>
          <em>{item[4]}</em>
        </div>
      ))}
    </section>
  );
}
