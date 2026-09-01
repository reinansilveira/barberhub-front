import { currency, initials } from "../../_shared/dashboard.utils";

export async function ProfessionalsPanel({ variant = "compact" }: { variant?: "compact" | "full" }) {
    // This panel remains usable while the professional API is unavailable.
    // The full management screen is populated by its client-side hook.
    const professionals: Array<{ id: string; name: string; revenue: number }> = [];
    const list = variant === "compact" ? professionals.slice(0, 5) : professionals;

    return (
        <div className="panel">
            <div className="panelTitle">
                <small>DESEMPENHO DA EQUIPE</small>
                {variant === "compact" && <a href="/dashboard?view=profissionais">Ver todos</a>}
            </div>

            {list.length === 0 ? (
                <p className="empty">Nenhum profissional cadastrado ainda.</p>
            ) : (
                <div className="table">
                    {list.map((pro) => (
                        <div key={pro.id}>
                            <b>
                                <i className="tableAvatar">{initials(pro.name)}</i>
                                {pro.name}
                            </b>
                            <span>{currency.format(pro.revenue)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
