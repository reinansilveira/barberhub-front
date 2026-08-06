import Link from "next/link";
import type { BookingServiceItem } from "../professional-profile.types";
import { formatDuration, formatPrice } from "../professional-profile.utils";
import { getCategoryIcon } from "../service-category-icons";

export const ServicesSection = ({
  services,
  selectedServiceId,
}: {
  services: BookingServiceItem[];
  selectedServiceId?: string;
}) => {
  return (
    <section className="card">
      <h2>Serviços e preços</h2>
      <div className="services">
        {services.map((item) => {
          const isSelected = item.serviceId === selectedServiceId;

          return (
            <article
              className={`service ${isSelected ? "serviceSelected" : ""}`}
              key={item.serviceId}
            >
              <span className="serviceIndex" title={item.service.category ?? "Outros"}>
                {getCategoryIcon(item.service.category)}
              </span>
              <div>
                <h3>{item.service.name}</h3>
                <p className="serviceDuration">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span>{formatDuration(item.service.duration)}</span>
                </p>
              </div>
              <strong>{formatPrice(item.customPrice ?? item.service.price)}</strong>
              <Link href={`?serviceId=${item.serviceId}#agendar`} className="serviceButton">
                {isSelected ? "Selecionado" : "Selecionar"}
              </Link>
            </article>
          );
        })}
        {!services.length && <p className="empty">Nenhum serviço disponível no momento.</p>}
      </div>
    </section>
  );
};
