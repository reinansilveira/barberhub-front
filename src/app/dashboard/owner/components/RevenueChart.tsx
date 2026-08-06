
import {
  money,
  dateText,
  timeText,
  isCancelled,
  isDone,
  statusLabel,
  type RevenueChartModel,
} from "../hooks/use-revenue-chart";

export const RevenueChart = ({ model }: { model: RevenueChartModel }) => {
  const lastDay = model.days[model.days.length - 1];

  return (
    <>
      <svg
        viewBox={`0 0 280 120`}
        style={{ width: "100%", height: "auto", marginBottom: "1rem", maxWidth: "280px" }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
        {model.days.map((day, index) => {
          const value = model.values[index] ?? 0;
          const barHeight = (value / model.max) * 100;
          const barWidth = 280 / model.days.length - 4;
          const x = (index * 280) / model.days.length + 2;
          const y = 100 - barHeight;

          return (
            <g key={day.date.toISOString()}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                fill="url(#barGradient)"
                opacity="0.85"
              />
              <text x={x + barWidth / 2} y="115" textAnchor="middle" fontSize="10" fill="#666">
                {dateText.format(day.date).split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="dayDetail">
        <div className="dayDetailHead">
          <b>{dateText.format(lastDay.date)}</b>
          <span>
            {money.format(lastDay.revenue)} em vendas · {lastDay.entries.length} agendamento(s)
          </span>
        </div>
        {lastDay.entries.length ? (
          <ul className="dayDetailList">
            {lastDay.entries.map((item) => (
              <li key={item.id}>
                <em>{timeText.format(new Date(item.scheduledAt))}</em>
                <span>
                  {item.service.name} · {item.client.name}
                </span>
                <b
                  className={
                    isCancelled(item.status)
                      ? "cancelled"
                      : isDone(item.status)
                        ? "complete"
                        : "pending"
                  }
                >
                  {statusLabel(item.status)}
                </b>
                <strong>{money.format(Number(item.price || 0))}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Nenhum agendamento nesse dia.</p>
        )}
      </div>
    </>
  );
}