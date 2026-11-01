import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { findServices } from "@/services/service";
import { currency } from "@/utils/format";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Veja os serviços, a duração e os valores de referência.",
};

export default async function ServicosPage() {
  const services = (await findServices().catch(() => [])).filter(
    (service) => service.active,
  );

  return (
    <ContentPage
      eyebrow="Serviços"
      title="Nossos serviços"
      description="Valores de referência. O preço final aparece no perfil de cada profissional antes de você confirmar."
    >
      {services.length ? (
        <ul className="content-page__cards">
          {services.map((service) => (
            <li key={service.id} className="content-page__card">
              <h2>{service.name}</h2>
              {service.description && <p>{service.description}</p>}
              <p className="content-page__card-meta">
                {service.duration ? (
                  <span>{service.duration} minutos</span>
                ) : null}
                {service.category ? <span>{service.category}</span> : null}
              </p>
              <p className="content-page__price">
                {currency.format(Number(service.price))}
              </p>
              <Link href="/agendar" className="content-page__button">
                Agendar<span className="sr-only"> {service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="content-page__empty">
          Nenhum serviço disponível no momento. Fale com a barbearia pela página
          de contato.
        </p>
      )}
    </ContentPage>
  );
}
