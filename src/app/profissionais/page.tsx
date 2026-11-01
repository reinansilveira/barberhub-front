import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { findAllProfessionals } from "@/services/professional";
import { findReviews, summarizeRatings } from "@/services/review";

export const metadata: Metadata = {
  title: "Profissionais",
  description: "Conheça a equipe e escolha com quem quer agendar.",
};

export default async function ProfissionaisPage() {
  const [professionals, reviews] = await Promise.all([
    findAllProfessionals(true).catch(() => []),
    findReviews().catch(() => []),
  ]);
  const { byProfessional } = summarizeRatings(reviews);

  return (
    <ContentPage
      eyebrow="Equipe"
      title="Nossos profissionais"
      description="Escolha quem vai te atender e veja os horários livres de cada um."
    >
      {professionals.length ? (
        <ul className="content-page__cards">
          {professionals.map((professional) => {
            const rating = byProfessional.get(professional.id);
            return (
              <li key={professional.id} className="content-page__card">
                <h2>{professional.user.name}</h2>
                <p className="content-page__card-meta">
                  {professional.specialty && (
                    <span>{professional.specialty}</span>
                  )}
                  {professional.experience ? (
                    <span>{professional.experience} anos de experiência</span>
                  ) : null}
                  <span>
                    {rating
                      ? `${rating.average.toFixed(1).replace(".", ",")}★ (${rating.count})`
                      : "Novo na equipe"}
                  </span>
                </p>
                {professional.bio && <p>{professional.bio}</p>}
                <Link
                  href={`/profissionais/${professional.id}`}
                  className="content-page__button"
                >
                  Ver perfil e horários
                  <span className="sr-only"> de {professional.user.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="content-page__empty">
          Nenhum profissional disponível no momento.
        </p>
      )}
    </ContentPage>
  );
}
