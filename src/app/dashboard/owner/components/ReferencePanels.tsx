"use client";

import { useState } from "react";
import type { OwnerView } from "../owner.types";

type MetricIconName = "calendar" | "pending" | "cancelled" | "wallet";
const metricIconNames: MetricIconName[] = ["calendar", "pending", "cancelled", "wallet"];

const barbers = ["Enzo Ribeiro", "Mateo Silva", "Lucas Mendes"];
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
  { duration: "30 min", rating: "4,9", icon: "✂" },
  { duration: "25 min", rating: "4,8", icon: "▣" },
  { duration: "60 min", rating: "5,0", icon: "✣" },
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
}: {
  title: string;
  subtitle: string;
  action: string;
}) {
  return (
    <header className="pageHead dashboard-page__header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button className="blackAction">{action}</button>
    </header>
  );
}
function MetricIcon({ name }: { name: MetricIconName }) {
  const paths = {
    calendar: (
      <>
        <path d="M8 2v3M16 2v3" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18m-12 6 2 2 4-4" />
      </>
    ),
    pending: (
      <>
        <path d="M16 14v2.2l1.6 1M16 4h2a2 2 0 0 1 2 2v.832M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
        <circle cx="16" cy="16" r="6" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
      </>
    ),
    cancelled: (
      <>
        <path d="M16 2v3M2 2l20 20M21 9h-5.5M3 9h6" />
        <path d="M3.586 3.586A2 2 0 0 0 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.414-.586M8.656 3H19a2 2 0 0 1 2 2v10.344" />
      </>
    ),
    wallet: (
      <>
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </>
    ),
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
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
function LineGraph() {
  return (
    <div className="financialChart">
      <div className="financialChart__plot">
        <div className="financialChart__scale" aria-hidden="true">
          {['2.500', '2.000', '1.500', '1.000', '500', '0'].map((value) => <span key={value}>{value}</span>)}
        </div>
        <svg viewBox="0 0 700 250" preserveAspectRatio="none" role="img" aria-label="Receita dos últimos sete dias">
          <path className="chartGrid" d="M0 20H700M0 65H700M0 110H700M0 155H700M0 200H700M0 245H700" />
          <path className="financialLine" d="M0 155 C55 135 83 125 116 135 S180 170 232 160 S293 115 350 95 S420 70 468 35 S535 18 583 27 S648 44 700 65" />
          {[[0, 155], [116, 135], [232, 160], [350, 95], [468, 35], [583, 27], [700, 65]].map(([cx, cy]) => <circle cx={cx} cy={cy} r="3.5" key={`${cx}-${cy}`} />)}
        </svg>
      </div>
      <div className="financialChart__labels">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}
      </div>
    </div>
  );
}

export function ReferencePanels({ view }: { view: OwnerView }) {
  const [calendarFilter, setCalendarFilter] = useState<"day" | "week" | "month">("week");
  const [calendarPeriod, setCalendarPeriod] = useState(0);

  if (view === "agenda")
    return (
      <div className="referencePage calendarPage calendar-page">
        <header className="pageHead dashboard-page__header calendar-page__header">
          <div>
            <h1>Calendário</h1>
            <p>{calendarPeriods[calendarPeriod]}</p>
          </div>
          <div className="calendar-page__header-actions">
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
            <button className="blackAction" type="button">+ Novo agendamento</button>
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
            <div className="calendarDays calendar-page__days">
              <div className="calendar-page__time-column">
                {["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "17h"].map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>
              {calendarDays.map((day) => (
                <div className={`calDay calendar-page__day${day.current ? " is-current" : ""}`} key={day.label}>
                  <header>
                    <small>{day.label}</small>
                    <b>{day.date}</b>
                  </header>
                  <div className="calendar-page__day-body">
                    {day.events.map(([row, title, detail, tone]) => (
                      <span className={`event calendar-page__event calendar-page__event--${tone}`} style={{ gridRow: String(row) }} key={`${title}-${detail}`}>
                        <strong>{title}</strong>
                        <em>{detail}</em>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
        />
        <MiniStats
          items={[
            ["●", "Barbeiros ativos", "3", ""],
            ["●", "Agendamentos hoje", "18", ""],
            ["●", "Avaliação média", "4,8", ""],
            ["●", "Receita da equipe", "R$ 8,4k", ""],
          ]}
        />
        <section className="barberCards">
          {barbers.map((name, i) => (
            <article className={`barber-card barber-card--${barberProfiles[i].stripe}`} key={name}>
              <span className={`cardStripe stripe${i}`} aria-hidden="true" />
              <header className="barber-card__header">
                <i className="barber-card__avatar">{name.slice(0, 2)}</i>
                <div>
                  <b>{name}</b>
                  <small>{barberProfiles[i].role}</small>
                  <em>★★★★★ <span>{barberProfiles[i].rating}</span></em>
                </div>
                <div className="barber-card__actions">
                  <button type="button" aria-label={`Editar ${name}`}>✎</button>
                  <button type="button" aria-label={`Mais opções de ${name}`}>···</button>
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
              <p className="barber-card__progress-label">
                Desempenho de hoje
                <b>{barberProfiles[i].progress}</b>
              </p>
              <div className="barber-card__progress"><span /></div>
              <footer className="barber-card__footer">
                <button type="button">▣ Agenda</button>
                <button type="button">▥ Métricas</button>
              </footer>
            </article>
          ))}
        </section>
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
        />
        <MiniStats
          items={[
            ["✂", "Serviços ativos", "12", ""],
            ["▣", "Agendamentos hoje", "24", ""],
            ["◷", "Duração média", "45 min", ""],
            ["◉", "Ticket médio", "R$ 65,00", ""],
          ]}
        />
        <section className="serviceCards">
          {services.map(([name, desc, bookings, price, rating, color], i) => (
            <article className="service-card" key={name}>
              <span className="service-card__stripe" style={{ background: color }} aria-hidden="true" />
              <header className="service-card__header">
                <i className="service-card__icon">{serviceProfiles[i].icon}</i>
                <div>
                  <b>{name}</b>
                  <small>{desc}</small>
                  <em>
                    ★★★★★ <small>{serviceProfiles[i].rating}</small>
                  </em>
                </div>
                <div className="service-card__actions">
                  <button type="button" aria-label={`Editar ${name}`}>✎</button>
                  <button type="button" aria-label={`Mais opções de ${name}`}>···</button>
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
                <button type="button">Editar</button>
                <button type="button">Métricas</button>
              </footer>
            </article>
          ))}
        </section>
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
            ["▣", "Receita total", "R$ 18.540,00", "+12,5%"],
            ["▤", "Ticket médio", "R$ 68,50", "+4,2%"],
            ["▣", "Agendamentos totais", "284", "-2,1%"],
            ["⌁", "Despesas", "R$ 4.210,00", "+8,4%"],
          ]}
        />
        <section className="referencePanel revenueOverview financial-page__revenue-overview">
          <div className="referencePanelHead">
            <h2>Visão geral da receita</h2>
            <select aria-label="Period">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este ano</option>
            </select>
          </div>
          <LineGraph />
        </section>
        <TransactionTable />
      </div>
    );

  return <SettingsPanel />;
}

function SettingsPanel() {
  const [tab, setTab] = useState("Business");
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
              {item === "Profile"
                ? "♙"
                : item === "Business"
                  ? "▣"
                  : item === "Notifications"
                    ? "♧"
                    : item === "Security"
                      ? "◐"
                      : "▤"}{" "}
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
          {tab === "Business" ? (
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
            <i>{service ? "✂" : barbers[row].slice(0, 2)}</i>
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
          <span>★ {service ? "4,9" : ["4,9", "4,7", "4,6"][row]}</span>
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
