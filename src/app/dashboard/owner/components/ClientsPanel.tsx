import { initials } from "../../_shared/dashboard.utils";

export function ClientsPanel({ clients }: { clients: string[] }) {
    return (
        <div className="panel">
            <div className="panelTitle">
                <small>CLIENTES</small>
                <span className="metricDescription">{clients.length} no total</span>
            </div>

            {clients.length === 0 ? (
                <p className="empty">Nenhum cliente cadastrado ainda.</p>
            ) : (
                <div className="clientList">
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
}