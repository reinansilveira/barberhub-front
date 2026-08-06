
interface StatItem {
	value: string;
	label: string;
}

const STATS: StatItem[] = [
	{ value: "12.5K+", label: "Agendamentos realizados" },
	{ value: "4.9★", label: "Avaliação média" },
	{ value: "24", label: "Profissionais ativos" },
	{ value: "98%", label: "Taxa de satisfação" },
];

export default function Stats() {
	return (
		<section className="stats">
			<div className="wrapper stats__inner">
				{STATS.map(({ value, label }) => (
					<div key={label} className="stats__item">
						<span className="stats__value">{value}</span>
						<span className="stats__label">{label}</span>
					</div>
				))}
			</div>
		</section>
	);
}
import "./Stats.scss";
