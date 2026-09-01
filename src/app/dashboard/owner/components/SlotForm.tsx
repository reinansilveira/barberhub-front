"use client";

import { useSlotForm } from "../hooks/use-slot-form";
import type { Service } from "@/services/service";

export function SlotForm({ services, onCreated }: { services: Service[]; onCreated?: () => void }) {
    const { values, update, submit, submitting, error } = useSlotForm(onCreated);

    return (
        <div className="panel">
            <div className="panelTitle">
                <small>NOVO AGENDAMENTO</small>
            </div>

            <form className="registerForm" onSubmit={submit}>
                <label>
                    Cliente
                    <input
                        type="text"
                        value={values.clientName}
                        onChange={(e) => update("clientName", e.target.value)}
                        placeholder="Nome do cliente"
                        required
                    />
                </label>

                <label>
                    Serviço
                    <select
                        value={values.serviceId}
                        onChange={(e) => update("serviceId", e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Selecione um serviço
                        </option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Data e hora
                    <input
                        type="datetime-local"
                        value={values.scheduledAt}
                        onChange={(e) => update("scheduledAt", e.target.value)}
                        required
                    />
                </label>

                {error && <p className="empty" style={{ color: "#d1353f" }}>{error}</p>}

                <button type="submit" className="primaryButton" disabled={submitting}>
                    {submitting ? "Salvando..." : "Confirmar agendamento"}
                </button>
            </form>
        </div>
    );
}