import { BarChart3, CalendarDays, MoreHorizontal, Pencil } from "lucide-react";
import type { Appointment } from "@/services/appointment";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { cn } from "@/utils/class-names";
import { currency } from "../../_shared/dashboard.utils";
import { useOpenDashboardModal } from "../../_shared/stores/dashboard-modals.store";
import type { ReferencePanelsModel } from "../hooks/use-reference-panels";
import { PerformanceMetrics, PerformanceTable } from "./ReferencePerformance";
import { MiniStats, PageHead } from "./ReferencePanelPrimitives";

export const ProfessionalsReferencePanel = ({
  appointments,
  panel,
  editError,
  savingEdit,
}: {
  appointments: Appointment[];
  panel: ReferencePanelsModel["professionals"];
  editError: string;
  savingEdit: boolean;
}) => {
  const openModal = useOpenDashboardModal();

  return (
    <div className="reference-page barbers-page">
      <PageHead
        title="Barbeiros"
        subtitle="Gerencie sua equipe e acompanhe o desempenho"
        action="+ Novo barbeiro"
        onAction={() => openModal("barber")}
      />
      <MiniStats
        items={[
          ["users", "Barbeiros ativos", String(panel.list.length), ""],
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
          ["star", "Avaliações", "Sem dados", ""],
          [
            "wallet",
            "Receita da equipe",
            currency.format(
              appointments
                .filter((item) => /complete/i.test(item.status))
                .reduce((total, item) => total + Number(item.price || 0), 0),
            ),
            "",
          ],
        ]}
      />
      <section className="barber-cards">
        {panel.list.length === 0 && (
          <p className="empty">Nenhum profissional cadastrado.</p>
        )}
        {panel.list.map((professional, index) => {
          const name = professional.user.name;
          const professionalAppointments = appointments.filter(
            (item) => item.professional?.name === name,
          );
          const completed = professionalAppointments.filter((item) =>
            /complete/i.test(item.status),
          );
          const todayCount = professionalAppointments.filter(
            (item) =>
              new Date(item.scheduledAt).toDateString() ===
              new Date().toDateString(),
          ).length;

          return (
            <article
              className={`barber-card barber-card--${
                ["green", "yellow", "violet"][index % 3]
              }`}
              key={professional.id}
            >
              <span
                className={`barber-card__stripe barber-card__stripe--${index}`}
                aria-hidden="true"
              />
              <header className="barber-card__header">
                <Avatar className="barber-card__avatar">
                  <AvatarImage src={professional.user.avatar} alt={name} />
                  <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <div>
                  <b>{name}</b>
                  <small>
                    {professional.specialty || "Especialidade não informada"}
                  </small>
                </div>
                <div className="barber-card__actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Editar ${name}`}
                    onClick={() => {
                      panel.openEdit(name);
                      panel.setOpenMenu(null);
                    }}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <div className="barber-card__menu-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Mais opções de ${name}`}
                      aria-expanded={panel.openMenu === professional.id}
                      aria-haspopup="menu"
                      onClick={() =>
                        panel.setOpenMenu(
                          panel.openMenu === professional.id
                            ? null
                            : professional.id,
                        )
                      }
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </Button>
                    {panel.openMenu === professional.id && (
                      <div className="barber-card__menu" role="menu">
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
                            <b>Editar perfil</b>
                            <small>Atualize os dados do barbeiro</small>
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
                            <small>Acompanhe o desempenho</small>
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              <div className="barber-card__numbers barber-card__metrics">
                <span>
                  <b>{completed.length}</b>Concluídos
                </span>
                <span>
                  <b>
                    {currency.format(
                      completed.reduce(
                        (total, item) => total + Number(item.price || 0),
                        0,
                      ),
                    )}
                  </b>
                  Receita
                </span>
                <span>
                  <b>{professional.experience ?? "—"}</b>Anos de experiência
                </span>
              </div>
              <Progress
                value={Math.min(100, todayCount * 12.5)}
                className="barber-card__progress"
              >
                <ProgressLabel>Desempenho de hoje</ProgressLabel>
                <ProgressValue>
                  {() => `${todayCount} agendamentos hoje`}
                </ProgressValue>
              </Progress>
              <footer className="barber-card__footer">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openModal("appointment")}
                >
                  <CalendarDays aria-hidden="true" /> Agenda
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
                  <BarChart3 aria-hidden="true" /> Métricas
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
                : "barber-action-panel entity-edit-modal__dialog"
            }
            aria-label={`Ação para ${panel.selected}`}
            role={panel.action === "edit" ? "dialog" : undefined}
            aria-modal={panel.action === "edit" ? "true" : undefined}
          >
            {panel.action === "edit" && (
              <div>
                <span className="barber-action-panel__eyebrow">
                  Editar profissional
                </span>
                <h2>{panel.selected}</h2>
                <p>
                  Atualize os dados do profissional e mantenha a equipe
                  organizada.
                </p>
              </div>
            )}
            {panel.action === "edit" ? (
              <div className="barber-action-panel__form">
                <label>
                  Especialidade
                  <input
                    value={panel.edit.specialty}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        specialty: event.target.value,
                      })
                    }
                    placeholder="Especialidade"
                  />
                </label>
                <label>
                  Experiência (anos)
                  <input
                    type="number"
                    min="0"
                    value={panel.edit.experience}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        experience: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Comissão (%)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={panel.edit.commission}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        commission: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="barber-action-panel__field--wide">
                  Bio
                  <textarea
                    rows={2}
                    value={panel.edit.bio}
                    onChange={(event) =>
                      panel.setEdit({
                        ...panel.edit,
                        bio: event.target.value,
                      })
                    }
                  />
                </label>
                {editError && (
                  <p className="barber-action-panel__error" role="alert">
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
                kind="barber"
                appointments={appointments}
              />
            )}
            <button
              className={
                panel.action === "metrics"
                  ? "metrics-view__close"
                  : "barber-action-panel__close"
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
        title="Performance Leaderboard"
        professionals={panel.list}
        appointments={appointments}
      />
    </div>
  );
};
