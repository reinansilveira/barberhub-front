
interface Testimonial {
	id: string;
	name: string;
	role: string;
	quote: string;
	rating: number;
	avatarUrl: string;
}

const TESTIMONIALS: Testimonial[] = [
	{
		id: "marcelo-oliveira",
		name: "Marcelo Oliveira",
		role: "Empresário",
		quote:
			"Melhor experiência de barbearia que já tive. O Ricardo é um artista, entende exatamente o que você quer. O agendamento pelo site é super prático, recebi o código no WhatsApp e pronto. Recomendo demais!",
		rating: 5,
		avatarUrl: "https://i.pravatar.cc/80?img=12",
	},
	{
		id: "rafael-costa",
		name: "Rafael Costa",
		role: "Designer",
		quote:
			"Ambiente incrível, atendimento de primeira e resultado impecável. O João fez um fade perfeito e a barba ficou exatamente como eu queria. O sistema de agendamento é muito fácil de usar.",
		rating: 5,
		avatarUrl: "https://i.pravatar.cc/80?img=33",
	},
	{
		id: "bruno-almeida",
		name: "Bruno Almeida",
		role: "Advogado",
		quote:
			"Sou cliente há mais de um ano e nunca me decepcionei. Todos os profissionais são excelentes, mas o Carlos é meu favorito. A barboterapia é sensacional, saio de lá renovado. Vale cada centavo!",
		rating: 5,
		avatarUrl: "https://i.pravatar.cc/80?img=51",
	},
	{
		id: "gustavo-lima",
		name: "Gustavo Lima",
		role: "Fotógrafo",
		quote:
			"Troquei de barbearia depois de anos indo no mesmo lugar e não me arrependo. Atendimento pontual, ambiente agradável e o resultado sempre supera a expectativa.",
		rating: 5,
		avatarUrl: "https://i.pravatar.cc/80?img=14",
	},
];

// Lista duplicada para o loop do marquee ficar contínuo e sem "salto"
const LOOPED_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS];

function StarRow({ rating }: { rating: number }) {
	return (
		<div className="testimonials__stars" aria-label={`Nota ${rating} de 5`}>
			{Array.from({ length: 5 }).map((_, index) => (
				<svg
					key={index}
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill={index < rating ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				</svg>
			))}
		</div>
	);
}

export default function Testimonials() {
	return (
		<section className="testimonials">
			<div className="wrapper testimonials__header">
				<span className="testimonials__label">Depoimentos</span>
				<h2 className="testimonials__title">
					O que dizem nossos clientes
				</h2>
				<p className="testimonials__subtitle">
					Experiências reais de quem confia no BarbeHub para cuidar do visual
				</p>
			</div>

			<div className="testimonials__marquee">
				<div className="testimonials__track">
					{LOOPED_TESTIMONIALS.map(
						({ id, name, role, quote, rating, avatarUrl }, index) => (
							<article
								key={`${id}-${index}`}
								className="testimonials__card"
							>
								<StarRow rating={rating} />

								<p className="testimonials__quote">&ldquo;{quote}&rdquo;</p>

								<div className="testimonials__author">
									<img
										src={avatarUrl}
										alt={name}
										loading="lazy"
										className="testimonials__avatar"
									/>
									<div className="testimonials__author_info">
										<span className="testimonials__name">{name}</span>
										<span className="testimonials__role">{role}</span>
									</div>
								</div>
							</article>
						)
					)}
				</div>
			</div>
		</section>
	);
}
import "./Testimonials.scss";
