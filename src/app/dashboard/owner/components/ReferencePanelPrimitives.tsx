import {
  CalendarCheck2,
  CalendarX2,
  Clock3,
  Plus,
  Scissors,
  Sparkles,
  Square,
  Star,
  UsersRound,
  WalletCards,
} from "lucide-react";

export type MetricIconName =
  | "calendar"
  | "pending"
  | "cancelled"
  | "wallet"
  | "scissors"
  | "star"
  | "users";

const metricIconNames: MetricIconName[] = [
  "calendar",
  "pending",
  "cancelled",
  "wallet",
  "scissors",
  "star",
  "users",
];

export const serviceProfiles = [
  { icon: "scissors" },
  { icon: "square" },
  { icon: "sparkles" },
];

export const PageHead = ({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action: string;
  onAction?: () => void;
}) => {
  return (
    <header className="reference-page__head dashboard-page__header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button
          className="reference-page__action dashboard-action-button"
          type="button"
          onClick={onAction}
        >
          {action.startsWith("+") && <Plus aria-hidden="true" />}{" "}
          {action.replace(/^\+\s*/, "")}
        </button>
      )}
    </header>
  );
};

const MetricIcon = ({ name }: { name: MetricIconName }) => {
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
};

export const ServiceIcon = ({ name }: { name: string }) => {
  const icons = {
    scissors: Scissors,
    square: Square,
    sparkles: Sparkles,
  } as const;
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;

  return <Icon aria-hidden="true" />;
};

export const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => {
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
};

export const MiniStats = ({
  items,
  className = "",
}: {
  items: Array<[MetricIconName | string, string, string, string]>;
  className?: string;
}) => {
  return (
    <section className={`mini-stats ${className}`}>
      {items.map(([icon, title, value, trend]) => (
        <article key={title}>
          <i className={`mini-stats__icon mini-stats__icon--${icon}`}>
            {metricIconNames.includes(icon as MetricIconName) ? (
              <MetricIcon name={icon as MetricIconName} />
            ) : (
              icon
            )}
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
};
