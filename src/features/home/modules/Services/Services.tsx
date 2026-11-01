import "./Services.scss";
import { findServices } from "@/services/service";
import { currency } from "@/utils/format";

const SCISSORS_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const BEARD_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" />
  </svg>
);

const CROWN_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m2 18 2-11 5 4 3-6 3 6 5-4 2 11H2Z" />
    <line x1="2" y1="21" x2="22" y2="21" />
  </svg>
);

const BRUSH_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.06 11.9 4.34 16.6a2.4 2.4 0 0 0 3.4 3.4l4.7-4.72" />
    <path d="M11.6 6.7 15 3.3a1.5 1.5 0 0 1 2.1 0l3.5 3.5a1.5 1.5 0 0 1 0 2.1l-3.4 3.4a1.5 1.5 0 0 1-2.1 0l-3.5-3.5a1.5 1.5 0 0 1 0-2.1Z" />
  </svg>
);

const LEAF_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 8-9 3.5 0 8 4 8 9a7 7 0 0 1-7 7Z" />
    <path d="M11 20v-9" />
  </svg>
);

const CHILD_ICON = (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v6" />
    <path d="m8 12 4 2 4-2" />
    <path d="m8 21 4-7 4 7" />
  </svg>
);

const SERVICE_ICONS = [
  SCISSORS_ICON,
  BEARD_ICON,
  CROWN_ICON,
  BRUSH_ICON,
  LEAF_ICON,
  CHILD_ICON,
];

export default async function Services() {
  const services = (await findServices().catch(() => [])).filter(
    (service) => service.active,
  );

  return (
    <section className="services">
      <div className="wrapper services__inner">
        <div className="services__header">
          <span className="services__label">Nossos serviços</span>
          <h2 className="services__title">Experiência completa</h2>
          <p className="services__subtitle">
            Valores de referência. O preço final aparece no perfil do
            profissional antes de confirmar.
          </p>
        </div>

        <div className="services__grid">
          {services.map((service, index) => (
            <article key={service.id} className="services__card">
              <div className="services__icon">
                {SERVICE_ICONS[index % SERVICE_ICONS.length]}
              </div>

              <h3 className="services__card-title">{service.name}</h3>
              <p className="services__description">
                {service.description || service.category || "Serviço BarberHub"}
              </p>

              <div className="services__footer">
                <div className="services__price-group">
                  <span className="services__price">
                    {currency.format(Number(service.price))}
                  </span>
                  <span className="services__duration">
                    {service.duration
                      ? `${service.duration} minutos`
                      : "Duração a confirmar"}
                  </span>
                </div>

                <a href="/agendar" className="services__link">
                  Agendar
                  <span className="sr-only"> {service.name}</span>
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
          {services.length === 0 && (
            <p className="services__empty">
              Nenhum serviço disponível no momento.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
