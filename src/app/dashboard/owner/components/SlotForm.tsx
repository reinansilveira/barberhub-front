import type { ProfessionalResponseDto } from "@/services/professional";
import { useSlotForm } from "../hooks/use-slot-form";

export const SlotForm = ({
    professional,
    onClose,
}: {
    professional: ProfessionalResponseDto;
    onClose: () => void;
}) => {
    const {
        date,
        setDate,
        time,
        setTime,
        pendingTimes,
        existing,
        loading,
        saving,
        feedback,
        error,
        addTime,
        removeTime,
        submit,
        removeExisting,
        timeText,
    } = useSlotForm(professional);

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                <div className="panelTitle">
                    <div>
                        <small>SLOTS</small>
                        <h2>Horários de {professional.user.name}</h2>
                    </div>
                    <button className="more" onClick={onClose} aria-label="Fechar">✕</button>
                </div>

                <div className="formRow">
                    <label>
                        Data
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </label>
                    <label>
                        Horário
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </label>
                    <button type="button" className="secondaryBtn" onClick={addTime}>
                        + Adicionar
                    </button>
                </div>

                {!!pendingTimes.length && (
                    <div className="chipRow">
                        {pendingTimes.map((t) => (
                            <span key={t} className="chip">
                                {t}
                                <button type="button" onClick={() => removeTime(t)} aria-label={`Remover ${t}`}>✕</button>
                            </span>
                        ))}
                    </div>
                )}

                {error && <p className="formError">{error}</p>}
                {feedback && <p className="formHint">{feedback}</p>}

                <button
                    type="button"
                    className="primaryBtn"
                    disabled={!pendingTimes.length || saving}
                    onClick={submit}
                >
                    {saving ? "Salvando..." : `Salvar ${pendingTimes.length || ""} horário(s)`}
                </button>

                <div className="dayDetail">
                    <div className="dayDetailHead">
                        <b>Horários existentes em {date}</b>
                    </div>
                    {loading ? (
                        <p className="empty">Carregando...</p>
                    ) : existing.length ? (
                        <ul className="dayDetailList">
                            {existing.map((slot) => (
                                <li key={slot.id}>
                                    <em>{timeText.format(new Date(slot.startsAt))}</em>
                                    <span>Disponível</span>
                                    <button type="button" className="secondaryBtn" onClick={() => removeExisting(slot.id)}>
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">Nenhum horário criado ainda.</p>
                    )}
                </div>
            </div>
        </div>
    );
}