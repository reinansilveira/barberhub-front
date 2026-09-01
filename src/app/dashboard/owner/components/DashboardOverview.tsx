import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import {
  currency,
  initials,
  isCompleted,
  timeText,
} from "../../_shared/dashboard.utils";

type DashboardOverviewProps = {
  appointments: Appointment[];
  services: Service[];
  recent: Appointment[];
  revenue: number;
  completedCount: number;
};
const fallback = [
  {
    id: "1",
    client: { name: "Diego Gomes" },
    service: "Corte + Barba",
    scheduledAt: "2026-08-18T09:00:00",
    price: 85,
    status: "confirmed",
  },
  {
    id: "2",
    client: { name: "Lucas Pereira" },
    service: "Corte Social",
    scheduledAt: "2026-08-18T10:30:00",
    price: 55,
    status: "confirmed",
  },
  {
    id: "3",
    client: { name: "Gabriel Costa" },
    service: "Corte + Barba",
    scheduledAt: "2026-08-18T11:30:00",
    price: 85,
    status: "pending",
  },
  {
    id: "4",
    client: { name: "Rafael Silva" },
    service: "Barba completa",
    scheduledAt: "2026-08-18T13:00:00",
    price: 45,
    status: "confirmed",
  },
  {
    id: "5",
    client: { name: "Thiago Santos" },
    service: "Corte Social",
    scheduledAt: "2026-08-18T14:30:00",
    price: 55,
    status: "confirmed",
  },
];

function Icon({ name }: { name: "calendar" | "users" | "more" | "wallet" }) {
  const paths = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.5-3.4 2.3-5.2 5.5-5.2s5 1.8 5.5 5.2M17 10a2.7 2.7 0 1 0-1.3-5.1M17 15c2.1.2 3.2 1.5 3.5 3.7" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2v-9.5Z" />
        <path d="M3 8h16M16 13h5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
function statusText(status: string) {
  return isCompleted(status) || status === "confirmed"
    ? "Completed"
    : "Pending";
}

export function DashboardOverview({
  appointments,
  recent,
  revenue,
  completedCount,
}: DashboardOverviewProps) {
  const rows = (recent.length ? recent : fallback).slice(0, 5) as Array<
    Appointment & { service?: string }
  >;
  return (
    <div className="referenceDashboard dashboard-overview">
      <section className="dashboardGreeting">
        <div>
          <h1>Bem vindo, Marcus!</h1>
          <p>Aqui está o que está rolando na sua barbearia hoje.</p>
        </div>
        <div className="dashboardGreetingActions">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 15V3" />
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
            </svg>{" "}
            Exportar
          </button>
          <a href="/dashboard?view=agenda">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Novo agendamento
          </a>
        </div>
      </section>
      <section className="referenceStats dashboard-overview__stats">
        <article>
          <span className="refStatIcon green">$</span>
          <p>Today&apos;s Earnings</p>
          <strong>{currency.format(revenue || 1250)}</strong>
          <small className="up">↗ +12.5% vs yesterday</small>
        </article>
        <article>
          <span className="refStatIcon violet">
            <Icon name="calendar" />
          </span>
          <p>Appointments</p>
          <strong>{appointments.length || 12}</strong>
          <small>{completedCount || 3} completed, 1 remaining</small>
        </article>
        <article>
          <span className="refStatIcon orange">
            <Icon name="users" />
          </span>
          <p>New Clients</p>
          <strong>5</strong>
          <small>↗ 20% more than last week</small>
        </article>
        <article className="satisfaction">
          <span className="refStatIcon yellow">★</span>
          <p>Client Satisfaction</p>
          <strong>88%</strong>
          <small>
            <i />
            <i />
            <i />
            <i />
            <i />
          </small>
        </article>
      </section>
      <section className="referenceAnalytics dashboard-overview__analytics">
        <article className="referencePanel earningChart">
          <div className="referencePanelHead">
            <div>
              <h2>Weekly Revenue</h2>
              <strong>
                {currency.format(8430)} <span className="up">↗ +12.5%</span>
              </strong>
            </div>
            <div className="chartTabs">
              <b>Week</b>
              <span>Month</span>
              <span>Year</span>
            </div>
          </div>
          <div className="chartPlot">
            <div className="yLabels">
              <span>$2,000</span>
              <span>$1,500</span>
              <span>$1,000</span>
              <span>$500</span>
              <span>$0</span>
            </div>
            <svg viewBox="0 0 500 180" preserveAspectRatio="none">
              <path
                className="chartGrid"
                d="M0 20H500M0 60H500M0 100H500M0 140H500M0 180H500"
              />
              <path
                className="chartArea"
                d="M0 142 C25 130,42 146,68 125 S109 96,139 111 S182 155,210 92 S253 44,280 59 S324 102,352 79 S396 27,425 44 S465 73,500 53 L500 180 L0 180Z"
              />
              <path
                className="chartLine"
                d="M0 142 C25 130,42 146,68 125 S109 96,139 111 S182 155,210 92 S253 44,280 59 S324 102,352 79 S396 27,425 44 S465 73,500 53"
              />
            </svg>
            <div className="xLabels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </article>
        <article className="referencePanel serviceBreakdown">
          <div className="referencePanelHead">
            <div>
              <h2>Service Mix</h2>
              <p>This week&apos;s breakdown</p>
            </div>
            <button>
              <Icon name="more" />
            </button>
          </div>
          <div className="donutDashboard">
            <div className="donutRing">
              <div>
                <small>Total</small>
                <b>128</b>
              </div>
            </div>
            <div className="serviceLegend">
              <p>
                <span className="legendDot mint" />
                Haircuts <b>60%</b>
              </p>
              <p>
                <span className="legendDot yellow" />
                Beards <b>25%</b>
              </p>
              <p>
                <span className="legendDot violet" />
                Packages <b>15%</b>
              </p>
            </div>
          </div>
        </article>
      </section>
      <section className="referenceTables">
        <article className="referencePanel recentTable">
          <div className="referencePanelHead">
            <div>
              <h2>Recent Appointments</h2>
              <p>Keep track of all your appointments</p>
            </div>
            <a href="/dashboard?view=agenda">View all ›</a>
          </div>
          <div className="tableHead">
            <span>Client</span>
            <span>Service</span>
            <span>Staff</span>
            <span>Time</span>
            <span>Price</span>
            <span>Status</span>
          </div>
          {rows.map((item, index) => {
            const source = item as unknown as {
              service?: { name?: string } | string;
            };
            const service =
              typeof source.service === "string"
                ? source.service
                : source.service?.name || fallback[index]?.service || "Haircut";
            return (
              <div className="appointmentRow" key={item.id}>
                <span className="refClient">
                  <i>{initials(item.client.name)}</i>
                  {item.client.name}
                </span>
                <span>{service}</span>
                <span>
                  <i className="miniStaff">M</i>Marcus
                </span>
                <span>{timeText.format(new Date(item.scheduledAt))}</span>
                <span>
                  {currency.format(
                    Number(item.price || fallback[index]?.price || 0)
                  )}
                </span>
                <b className={statusText(item.status).toLowerCase()}>
                  {statusText(item.status)}
                </b>
              </div>
            );
          })}
        </article>
        <article className="referencePanel nextUp">
          <div className="referencePanelHead">
            <div>
              <h2>Next Up</h2>
              <p>In 20 min</p>
            </div>
            <a href="/dashboard?view=agenda">View all</a>
          </div>
          {rows.slice(0, 3).map((item, index) => (
            <div className="nextItem" key={`next-${item.id}`}>
              <i>{initials(item.client.name)}</i>
              <div>
                <b>{item.client.name}</b>
                <span>{index === 0 ? "Haircut + Beard" : "Haircut"}</span>
              </div>
              <strong>
                {index === 0
                  ? "10:30 am"
                  : index === 1
                    ? "11:15 am"
                    : "1:15 pm"}
              </strong>
            </div>
          ))}
        </article>
      </section>
      <section className="balanceCard">
        <div className="balanceIcon">
          <Icon name="wallet" />
        </div>
        <div>
          <span>Your Wallet</span>
          <p>Available for transfer</p>
        </div>
        <strong>{currency.format(14280)}</strong>
        <div className="walletActions">
          <button aria-label="Wallet details">↗</button>
          <button aria-label="More wallet actions">⋮</button>
        </div>
        <footer>
          <b>Withdraw Funds</b>
          <span>Payment history</span>
          <span>Add payment method</span>
        </footer>
      </section>
    </div>
  );
}

