import { initials } from "../../_shared/dashboard.utils";

export const ClientsPanel = ({ clients }: { clients: string[] }) => {
  return (
    <div className="panel">
      <div className="panel__title">
        <small>CLIENTES</small>
        <span className="panel__description">{clients.length} no total</span>
      </div>

      {clients.length === 0 ? (
        <p className="empty">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div className="client-list">
          {clients.map((name) => (
            <article key={name}>
              <span>{initials(name)}</span>
              <div>
                <b>{name}</b>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
