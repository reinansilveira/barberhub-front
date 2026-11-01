import {
  Check,
  Camera,
  ChevronRight,
  Clock3,
  CreditCard,
  PencilLine,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currency, initials, timeText } from "../../_shared/dashboard.utils";
import {
  appointmentStatusLabel,
  fullDateText,
  getAppointmentDateBadge,
} from "../client-dashboard.utils";
import {
  CLIENT_PROFILE_FORM_ID,
  useClientAccount,
} from "../hooks/use-client-account";
import { useClientAccountDetails } from "../hooks/use-client-account-details";
import { ClientAvatarModal } from "./ClientAvatarModal";
import { ClientSecurityActions } from "./ClientSecurityActions";

const NOTIFICATION_PREFERENCES = [
  ["emailEnabled", "E-mail", "Confirmações e lembretes por e-mail."],
  [
    "whatsappEnabled",
    "WhatsApp",
    "Atualizações de agendamentos pelo WhatsApp.",
  ],
  ["smsEnabled", "SMS", "Mensagens de texto quando disponíveis."],
  [
    "pushEnabled",
    "Notificações push",
    "Alertas no dispositivo quando disponíveis.",
  ],
] as const;

export function ClientAccount() {
  const account = useClientAccount();
  const accountDetails = useClientAccountDetails();
  const { client, nextAppointment } = account;
  const nextAppointmentDate = nextAppointment
    ? getAppointmentDateBadge(nextAppointment.scheduledAt)
    : null;
  const accountDetailsData = accountDetails.details;
  const notificationPreferences = accountDetailsData?.notificationPreferences;

  return (
    <div className="client-account">
      <section className="client-account__profile-card">
        <ClientAvatarModal
          trigger={(open, avatar) => (
            <button
              className="client-account__photo"
              type="button"
              aria-label="Alterar foto do perfil"
              onClick={open}
            >
              <Avatar className="client-account__photo-avatar">
                <AvatarImage src={avatar} alt={client.name} />
                <AvatarFallback>{initials(client.name)}</AvatarFallback>
              </Avatar>
              <span className="client-account__photo-action" aria-hidden="true">
                <Camera />
              </span>
              <span className="client-account__photo-edit" aria-hidden="true">
                <PencilLine />
              </span>
            </button>
          )}
        />
        <h2>{client.name}</h2>
        <p>{client.email || "E-mail não informado"}</p>
        <b className="client-account__vip">Conta ativa</b>
        <button
          className="client-account__profile-edit"
          type="button"
          onClick={account.focusProfileForm}
        >
          <PencilLine aria-hidden="true" /> Editar perfil
        </button>
        <div className="client-account__totals">
          <div>
            <strong>{account.completedCount}</strong>
            <span>Atendimentos</span>
          </div>
          <div>
            <strong>{account.appointmentsCount}</strong>
            <span>Agendamentos</span>
          </div>
          <div>
            <strong>{currency.format(account.totalSpent)}</strong>
            <span>Total concluído</span>
          </div>
        </div>
      </section>

      <section className="client-account__details">
        <div
          className="member-card member-card--form"
          id={CLIENT_PROFILE_FORM_ID}
        >
          <div className="member-card__heading">
            <div>
              <h2>Informações pessoais</h2>
              <p>Mantenha seus dados atualizados.</p>
            </div>
            <button
              className="member-button member-button--dark"
              type="button"
              onClick={account.saveProfile}
              disabled={account.saving}
            >
              {account.saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
          <div className="member-form">
            <label>
              Nome completo
              <input
                value={account.form.name}
                onChange={(event) =>
                  account.setFormField("name", event.target.value)
                }
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={account.form.email}
                onChange={(event) =>
                  account.setFormField("email", event.target.value)
                }
              />
            </label>
            <label>
              Telefone
              <input
                inputMode="tel"
                value={account.form.phone}
                onChange={(event) =>
                  account.setFormField("phone", event.target.value)
                }
              />
            </label>
          </div>
          {account.feedback && (
            <p className="member-feedback" role="status">
              {account.feedback}
            </p>
          )}
        </div>

        <section className="member-card client-account__next">
          <div className="member-card__heading">
            <div>
              <h2>Próximo agendamento</h2>
              <p>
                {nextAppointment
                  ? "Seu horário está reservado."
                  : "Nenhum horário futuro."}
              </p>
            </div>
            {nextAppointment && (
              <span className="member-status member-status--success">
                <Check aria-hidden="true" />
                {appointmentStatusLabel(nextAppointment.status)}
              </span>
            )}
          </div>
          {nextAppointment && nextAppointmentDate ? (
            <div className="client-account__appointment">
              <b className="client-account__date">
                <small>{nextAppointmentDate.month}</small>
                {nextAppointmentDate.day}
              </b>
              <div>
                <h3>{nextAppointment.service.name}</h3>
                <p>
                  <Clock3 aria-hidden="true" />
                  {fullDateText.format(
                    new Date(nextAppointment.scheduledAt),
                  )}{" "}
                  às {timeText.format(new Date(nextAppointment.scheduledAt))}
                </p>
                <small>com {nextAppointment.professional.user.name}</small>
              </div>
              <strong>
                {currency.format(Number(nextAppointment.price || 0))}
              </strong>
              <button
                className="member-button"
                type="button"
                onClick={() => account.openReschedule(nextAppointment)}
              >
                <Plus aria-hidden="true" /> Remarcar
              </button>
              <button
                type="button"
                className="client-account__cancel"
                disabled={account.cancellingId === nextAppointment.id}
                onClick={() => account.cancelAppointment(nextAppointment)}
              >
                {account.cancellingId === nextAppointment.id
                  ? "Cancelando..."
                  : "Cancelar"}
              </button>
            </div>
          ) : (
            <p className="empty">
              Quando você agendar um horário, ele aparecerá aqui.
            </p>
          )}
        </section>

        <section className="member-card client-account__history">
          <div className="member-card__heading">
            <div>
              <h2>Histórico de cortes</h2>
              <p>Atendimentos concluídos.</p>
            </div>
            <a href="/dashboard?view=agendamentos">
              Ver tudo <ChevronRight aria-hidden="true" />
            </a>
          </div>
          <div className="member-table">
            <table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Profissional</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {account.history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="member-table__empty">
                      Nenhum atendimento concluído.
                    </td>
                  </tr>
                )}
                {account.history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.service.name}</td>
                    <td>{item.professional.user.name}</td>
                    <td>{fullDateText.format(new Date(item.scheduledAt))}</td>
                    <td>{currency.format(Number(item.price || 0))}</td>
                    <td>{appointmentStatusLabel(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <aside className="client-account__aside">
        <section className="client-account__loyalty">
          <header className="client-account__loyalty-heading">
            <h2>Histórico de fidelidade</h2>
            <b className="client-account__loyalty-badge">
              Baseado em atendimentos concluídos
            </b>
          </header>
          {accountDetails.loading ? (
            <p>Carregando dados de fidelidade...</p>
          ) : accountDetails.error || !accountDetailsData ? (
            <p>
              {accountDetails.error ||
                "Não foi possível carregar os dados de fidelidade."}
            </p>
          ) : (
            <>
              <strong>
                {accountDetailsData.loyalty.completedAppointments}{" "}
                <small>atendimentos</small>
              </strong>
              <p>
                Total concluído:{" "}
                {currency.format(accountDetailsData.loyalty.totalSpent)}
              </p>
              {accountDetailsData.loyalty.lastCompletedAt && (
                <p>
                  Último atendimento em{" "}
                  {fullDateText.format(
                    new Date(accountDetailsData.loyalty.lastCompletedAt),
                  )}
                  .
                </p>
              )}
              {accountDetailsData.loyalty.reward === null && (
                <p>Nenhuma recompensa configurada no momento.</p>
              )}
            </>
          )}
        </section>
        <section className="member-card client-account__payment">
          <div className="member-card__heading">
            <div>
              <h2>Formas de pagamento</h2>
              <p>Dados protegidos e exibidos somente quando disponíveis.</p>
            </div>
          </div>
          {accountDetails.loading ? (
            <p className="empty">Carregando formas de pagamento...</p>
          ) : accountDetails.error || !accountDetailsData ? (
            <p className="empty">
              {accountDetails.error ||
                "Não foi possível carregar as formas de pagamento."}
            </p>
          ) : accountDetailsData.paymentMethods.length ? (
            accountDetailsData.paymentMethods.map((method) => (
              <div className="client-account__payment-row" key={method.id}>
                <span className="client-account__payment-icon">
                  <CreditCard aria-hidden="true" />
                </span>
                <div>
                  <b>{method.brand || "Cartão"}</b>
                  <small>
                    {method.last4
                      ? `Final ${method.last4}`
                      : "Dados protegidos"}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="client-account__payment-row">
              <span className="client-account__payment-icon">
                <CreditCard aria-hidden="true" />
              </span>
              <div>
                <b>Nenhuma forma de pagamento vinculada</b>
                <small>
                  Quando houver uma forma salva, ela aparecerá aqui.
                </small>
              </div>
            </div>
          )}
        </section>
        <section className="member-card client-account__preferences">
          <h2>Preferências de notificações</h2>
          {accountDetails.loading ? (
            <p className="empty">Carregando preferências...</p>
          ) : accountDetails.error || !notificationPreferences ? (
            <>
              <p className="empty">
                {accountDetails.error ||
                  "Não foi possível carregar as preferências."}
              </p>
              <button type="button" onClick={accountDetails.retry}>
                Tentar novamente
              </button>
            </>
          ) : (
            NOTIFICATION_PREFERENCES.map(([preference, label, description]) => (
              <label key={preference}>
                <span>
                  <b>{label}</b>
                  <small>{description}</small>
                </span>
                <input
                  type="checkbox"
                  checked={notificationPreferences[preference]}
                  disabled={accountDetails.savingPreferences}
                  onChange={(event) =>
                    accountDetails.updatePreferences(
                      preference,
                      event.target.checked,
                    )
                  }
                />
              </label>
            ))
          )}
          <ClientSecurityActions
            phone={client.phone ?? ""}
            twoFactorEnabled={client.twoFactorEnabled ?? false}
          />
        </section>
      </aside>
    </div>
  );
}
