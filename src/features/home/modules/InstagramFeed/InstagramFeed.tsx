
interface InstagramPost {
	id: string;
	imageUrl: string;
	alt: string;
}

const INSTAGRAM_HANDLE = "barbehub";

const INSTAGRAM_POSTS: InstagramPost[] = [
	{
		id: "post-1",
		imageUrl:
			"https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop",
		alt: "Ambiente interno da barbearia",
	},
	{
		id: "post-2",
		imageUrl:
			"https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop",
		alt: "Cliente durante o acabamento da barba",
	},
	{
		id: "post-3",
		imageUrl:
			"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
		alt: "Corte finalizado em cliente",
	},
	{
		id: "post-4",
		imageUrl:
			"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
		alt: "Ferramentas de barbearia sobre a bancada",
	},
	{
		id: "post-5",
		imageUrl:
			"https://images.unsplash.com/photo-1596728325488-58c87691e9af?q=80&w=800&auto=format&fit=crop",
		alt: "Barbeiro aparando barba com navalha",
	},
	{
		id: "post-6",
		imageUrl:
			"https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=800&auto=format&fit=crop",
		alt: "Comparativo de corte antes e depois",
	},
];

export default function InstagramFeed() {
	return (
		<section className="instagram-feed">
			<div className="wrapper instagram-feed__inner">
				<div className="instagram-feed__header">
					<span className="instagram-feed__label">Siga-nos</span>
					<h2 className="instagram-feed__title">
						@{INSTAGRAM_HANDLE}
					</h2>
					<p className="instagram-feed__subtitle">
						Acompanhe nosso trabalho diário e inspire-se com os melhores
						cortes
					</p>

					<a
						href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
						target="_blank"
						rel="noopener noreferrer"
						className="instagram-feed__cta"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="2" y="2" width="20" height="20" rx="5" />
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
						</svg>
						Seguir no Instagram
					</a>
				</div>

				<div className="instagram-feed__grid">
					{INSTAGRAM_POSTS.map(({ id, imageUrl, alt }) => (
						<a
							key={id}
							href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
							target="_blank"
							rel="noopener noreferrer"
							className="instagram-feed__item"
						>
							<img
								src={imageUrl}
								alt={alt}
								loading="lazy"
								className="instagram-feed__image"
							/>

							<span className="instagram-feed__overlay">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
import "./InstagramFeed.scss";
