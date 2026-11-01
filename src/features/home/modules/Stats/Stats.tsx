import { findAllProfessionals } from "@/services/professional";
import { findReviews, summarizeRatings } from "@/services/review";
import { findServices } from "@/services/service";
import "./Stats.scss";

export default async function Stats() {
  const [professionals, services, reviews] = await Promise.all([
    findAllProfessionals(true).catch(() => []),
    findServices().catch(() => []),
    findReviews().catch(() => []),
  ]);
  const ratings = summarizeRatings(reviews);

  const stats = [
    { value: String(professionals.length), label: "Profissionais na equipe" },
    {
      value: String(services.filter((service) => service.active).length),
      label: "Serviços disponíveis",
    },
    ratings.overall !== null && {
      value: `${ratings.overall.toFixed(1).replace(".", ",")}★`,
      label: `Média de ${ratings.count} ${ratings.count === 1 ? "avaliação" : "avaliações"}`,
    },
    { value: "24h", label: "Agendamento online" },
  ].filter((stat): stat is { value: string; label: string } => Boolean(stat));

  return (
    <section className="stats" aria-label="BarberHub em números">
      <dl className="wrapper stats__inner">
        {stats.map(({ value, label }) => (
          <div key={label} className="stats__item">
            <dt className="stats__label">{label}</dt>
            <dd className="stats__value">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
