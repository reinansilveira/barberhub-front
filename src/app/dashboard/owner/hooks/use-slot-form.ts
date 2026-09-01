"use client";

import { useState } from "react";
import type { Service } from "@/services/service";

export type SlotFormValues = {
    clientName: string;
    serviceId: string;
    scheduledAt: string; // datetime-local value
};

const EMPTY: SlotFormValues = { clientName: "", serviceId: "", scheduledAt: "" };

export function useSlotForm(onCreated?: () => void) {
    const [values, setValues] = useState<SlotFormValues>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof SlotFormValues>(key: K, value: SlotFormValues[K]) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Swap for your real client-side API call / server action.
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Falha ao criar agendamento");

            setValues(EMPTY);
            onCreated?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setSubmitting(false);
        }
    }

    return { values, update, submit, submitting, error };
}

export type { Service };