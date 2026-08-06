"use client";
import { SlotForm } from "./SlotForm";
import { useProfessionalsPanel } from "../hooks/use-professionals-panel";

export const ProfessionalsPanel = () => {
    const {
        list,
        loading,
        error,
        query,
        setQuery,
        form,
        updateForm,
        saving,
        createdCreds,
        slotsFor,
        setSlotsFor,
        filtered,
        submit,
        remove,
    } = useProfessionalsPanel();

    return (
        <div className="overview">
            <article className="panel">
                <div className="panelTitle">
                    <div>
                        <small>CADASTRO</small>
                        <h2>Cadastrar profissional</h2>
                    </div>
                </div>
                <form className="registerForm" onSubmit={submit}>
                    <label>
                        Nome
                        <input
                            required
                            value={form.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                        />
                    </label>
                    <label>
                        E-mail
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => updateForm("email", e.target.value)}
                        />
                    </label>
                    <label>
                        Telefone
                        <input
                            value={form.phone}
                            onChange={(e) => updateForm("phone", e.target.value)}
                        />
                    </label>
                    <label>
                        Especialidade
                        <input
                            value={form.specialty}
                            onChange={(e) => updateForm("specialty", e.target.value)}
                        />
                    </label>
                    <label>
                        Bio
                        <input
                            value={form.bio}
                            onChange={(e) => updateForm("bio", e.target.value)}
                        />
                    </label>
                    <label>
                        Experiência (anos)
                        <input
                            type="number"
                            min="0"
                            value={form.experience}
                            onChange={(e) => updateForm("experience", e.target.value)}
                        />
                    </label>
                    <label>
                        Comissão (%)
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={form.commission}
                            onChange={(e) => updateForm("commission", e.target.value)}
                        />
                    </label>
                    <button type="submit" className="primaryBtn" disabled={saving}>
                        {saving ? "Salvando..." : "Salvar cadastro"}
                    </button>
                </form>
                {error && <p className="formError">{error}</p>}
                {createdCreds && (
                    <p className="formHint">
                        Cadastrado! Login: <b>{createdCreds.email}</b> · Senha temporária:{" "}
                        <b>{createdCreds.password}</b>
                    </p>
                )}
            </article>

            <article className="panel">
                <div className="panelTitle">
                    <div>
                        <small>EQUIPE</small>
                        <h2>Profissionais</h2>
                    </div>
                    <strong>{list.length} cadastrado(s)</strong>
                </div>
                <input
                    className="searchInput"
                    placeholder="Buscar por nome ou especialidade..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading ? (
                    <p className="empty">Carregando...</p>
                ) : filtered.length ? (
                    <div className="table">
                        <div>
                            <small>Nome</small>
                            <small>Ações</small>
                        </div>
                        {filtered.map((p) => (
                            <div key={p.id}>
                                <b>
                                    <i className="avatar">{p.user.name[0]?.toUpperCase()}</i>
                                    {p.user.name}
                                    {p.specialty ? ` · ${p.specialty}` : ""}
                                </b>
                                <span className="rowActions">
                                    <button
                                        type="button"
                                        className="secondaryBtn"
                                        onClick={() => setSlotsFor(p)}
                                    >
                                        Criar horários
                                    </button>
                                    <button type="button" className="secondaryBtn" onClick={() => remove(p.id)}>
                                        Desativar
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty">Nenhum profissional encontrado.</p>
                )}
            </article>

            {slotsFor && <SlotForm professional={slotsFor} onClose={() => setSlotsFor(null)} />}
        </div>
    );
}