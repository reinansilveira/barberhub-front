import { BarChart3, MoreHorizontal, Pencil } from "lucide-react";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/class-names";
import { currency } from "../../_shared/dashboard.utils";
import { useOpenDashboardModal } from "../../_shared/stores/dashboard-modals.store";
import type { ReferencePanelsModel } from "../hooks/use-reference-panels";
import { PerformanceMetrics, PerformanceTable } from "./ReferencePerformance";
import {
  MiniStats,
  PageHead,
  ServiceIcon,
  serviceProfiles,
} from "./ReferencePanelPrimitives";

export const ServicesReferencePanel = ({
  appointments,
  services,
  panel,
  editError,
  savingEdit,
}: {
  appointments: Appointment[];
  services: Service[];
  panel: ReferencePanelsModel["services"];
  editError: string;
  savingEdit: boolean;
}) => {
  const openModal = useOpenDashboardModal();

  return (
    <div className="reference-page service-page">
      <PageHead
        title="Serviços"
        subtitle="Gerencie seu catálogo de serviços e preços"
        action="+ Novo serviço"
        onAction={() => openModal("service")}
      />
      <MiniStats
        items={[
          ["scissors", "Serviços ativos", String(services.length), ""],
          [
            "calendar",
            "Agendamentos hoje",
            String(
              appointments.filter(
                (item) =>
                  new Date(item.scheduledAt).toDateString() ===
                  new Date().toDateString(),
              ).length,
            ),
            "",
          ],
          [
            "pending",
            "Duração média",
            `${
              services.length
                ? Math.round(
                    services.reduce(
                      (total, item) => total + Number(item.duration || 0),
                      0,
                    ) / services.length,
                  )
                : 0
            } min`,
            "",
          ],
          [
            "wallet",
            "Ticket médio",
            currency.format(
              appointments.length
                ? appointments.reduce(
                    (total, item) => total + Number(item.price || 0),
                    0,
                  ) / appointments.length
                : 0,
            ),
            "",
          ],
        ]}
      />
      <section className="service-cards">
        {services.length === 0 && (
          <p className="empty">Nenhum serviço cadastrado.</p>
        )}
        {services.map((service, index) => {
          const name = service.name;
          const serviceAppointments = appointments.filter(
            (item) => item.service?.name === name,
          );

          return (
            <article
              className={`service-card service-card--${
                ["green", "yellow", "violet"][index % 3]
              }`}
              key={service.id}
            >
              <span className="service-card__stripe" aria-hidden="true" />
              <header className="service-card__header">
                <i className="service-card__icon">
                  <ServiceIcon
                    name={serviceProfiles[index % serviceProfiles.length].icon}
                  />
                </i>
                <div>
                  <b>{name}</b>
                  <small>
                    {service.description || service.category || "Sem descrição"}
                  </small>
                </div>
                <div className="service-card__actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Editar ${name}`}
                    onClick={() => panel.openEdit(name)}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <div className="service-card__menu-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Mais opções de ${name}`}
                      aria-expanded={panel.openMenu === service.id}
                      aria-haspopup="menu"
                      onClick={() =>
                        panel.setOpenMenu(
                          panel.openMenu === service.id ? null : service.id,
                        )
                      }
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </Button>
                    {panel.openMenu === service.id && (
                      <div className="service-card__menu" role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            panel.openEdit(name);
                            panel.setOpenMenu(null);
                          }}
                        >
                          <Pencil aria-hidden="true" />
                          <span>
                            <b>Editar serviço</b>
                            <small>Altere preço, duração e detalhes</small>
                          </span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            panel.setSelected(name);
                            panel.setAction("metrics");
                            panel.setOpenMenu(null);
                          }}
                        >
                          <BarChart3 aria-hidden="true" />
                          <span>
                            <b>Ver métricas</b>
                            <small>Acompanhe procura e receita</small>
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              <div className="service-card__metrics">
                <p>
                  <b>{serviceAppointments.length}</b>Agendamentos
                </p>
                <p>
                  <b>{currency.format(Number(service.price || 0))}</b>Preço
                </p>
                <p>
                  <b>{service.active ? "Ativo" : "Inativo"}</b>Status
                </p>
              </div>
              <footer className="service-card__footer">
                <small>
                  Duração:{" "}
                  <b>
                    {service.duration
                      ? `${service.duration} min`
                      : "Não informada"}
                  </b>
                </small>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => panel.openEdit(name)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    panel.setSelected(name);
                    panel.setAction("metrics");
                  }}
                >
                  Métricas
                </Button>
              </footer>
            </article>
          );
        })}
      </section>
      {panel.selected && (
        <div
          className={cn(
            "entity-edit-modal",
            panel.action === "metrics" && "entity-edit-modal--metrics",
          )}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) panel.setSelected(null);
          }}
        >
          <section
            className={
              panel.action === "metrics"
                ? "metrics-view"
                : "service-action-panel entity-edit-modal__dialog"
            }
            aria-label={`Ação para ${panel.selected}`}
            role={panel.action === "edit" ? "dialog" : undefined}
            aria-modal={panel.action === "edit" ? "true" : undefined}
          >
            {panel.action === "edit" && (
              <div>
                <span>Editar serviço</span>
                <h2>{panel.selected}</h2>
                <p>Atualize os dados exibidos no catálogo.</p>
              </div>
            )}
            {panel.action === "edit" ? (
              <div className="service-action-panel__form">
                <label>
                  Nome
                  <input
                    value={panel.edit.name}
                    onChange={(event) =>
                      panel.setEdit({ ...panel.edit, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Preço
                  <input
                    inputMode="decimal"
                    value={panel.edit.price}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        price: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Duração (minutos)
                  <input
                    type="number"
                    min="1"
                    value={panel.edit.duration}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        duration: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Categoria
                  <input
                    value={panel.edit.category}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        category: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="service-action-panel__field--wide">
                  Descrição
                  <textarea
                    rows={2}
                    value={panel.edit.description}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        description: event.target.value,
                      })
                    }
                  />
                </label>
                {editError && (
                  <p className="service-action-panel__error" role="alert">
                    {editError}
                  </p>
                )}
                <Button
                  type="button"
                  disabled={savingEdit}
                  onClick={panel.saveEdit}
                >
                  {savingEdit ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            ) : (
              <PerformanceMetrics
                name={panel.selected}
                kind="service"
                appointments={appointments}
              />
            )}
            <button
              className={
                panel.action === "metrics"
                  ? "metrics-view__close"
                  : "service-action-panel__close"
              }
              type="button"
              aria-label="Fechar painel"
              onClick={() => panel.setSelected(null)}
            >
              ×
            </button>
          </section>
        </div>
      )}
      <PerformanceTable
        title="Desempenho dos serviços"
        service
        services={services}
        appointments={appointments}
      />
    </div>
  );
};
