"use client";
import { useServicesPanel } from "../hooks/use-services-panel";

export const ServicesPanel = () => {
    const {
        list,
        loading,
        error,
        query,
        setQuery,
        form,
        updateForm,
        saving,
        filtered,
        submit,
        remove,
        money,
    } = useServicesPanel();

    return (
        <div className="overview">
            <article className="panel">
                <div className="panelTitle">
                    <div>
                        <small>CADASTRO</small>
                        <h2>Cadastrar serviço</h2>
                    </div>
                </div>
                <form className="registerForm" onSubmit={submit}>
                    <label>
                        Nome
                        <input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
                    </label>
                    <label>
                        Preço (R$)
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={(e) => updateForm("price", e.target.value)}
                        />
                    </label>
                    <label>
                        Duração (min)
                        <input
                            type="number"
                            min="0"
                            value={form.duration}
                            onChange={(e) => updateForm("duration", e.target.value)}
                        />
                    </label>
                    <label>
                        Categoria
                        <input value={form.category} onChange={(e) => updateForm("category", e.target.value)} />
                    </label>
                    <label>
                        Descrição
                        <input value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
                    </label>
                    <button type="submit" className="primaryBtn" disabled={saving}>
                        {saving ? "Salvando..." : "Salvar cadastro"}
                    </button>
                </form>
                {error && <p className="formError">{error}</p>}
            </article>

            <article className="panel">
                <div className="panelTitle">
                    <div>
                        <small>CATÁLOGO</small>
                        <h2>Serviços</h2>
                    </div>
                    <strong>{list.length} ativo(s)</strong>
                </div>
                <input
                    className="searchInput"
                    placeholder="Buscar serviço..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading ? (
                    <p className="empty">Carregando...</p>
                ) : filtered.length ? (
                    <div className="table">
                        <div>
                            <small>Serviço</small>
                            <small>Preço</small>
                        </div>
                        {filtered.map((s) => (
                            <div key={s.id}>
                                <b>
                                    {s.name}
                                    {s.category ? ` · ${s.category}` : ""}
                                </b>
                                <span className="rowActions">
                                    {money.format(Number(s.price))}
                                    <button type="button" className="secondaryBtn" onClick={() => remove(s.id)}>
                                        Desativar
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty">Nenhum serviço encontrado.</p>
                )}
            </article>
        </div>
    );
}