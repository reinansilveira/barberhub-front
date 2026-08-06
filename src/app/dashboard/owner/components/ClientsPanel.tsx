import type { Appointment } from "@/services/appointment";

export const ClientsPanel = ({ appointments, clients }: { appointments: Appointment[]; clients: string[] }) => {
  return (
    <section className="panel">
      <div className="panelTitle">
        <div>
          <small>RELACIONAMENTO</small>
          <h2>Clientes</h2>
        </div>
        <strong>{clients.length} clientes</strong>
      </div>

      <div className="clientList">
        {clients.map((client) => (
          <article key={client}>
            <span>{client[0]}</span>
            <b>{client}</b>
            <small>
              {appointments.filter((item) => item.client.name === client).length} agendamento(s)
            </small>
          </article>
        ))}
        {!clients.length && <p>Nenhum cliente cadastrado ainda.</p>}
      </div>
    </section>
  );
}