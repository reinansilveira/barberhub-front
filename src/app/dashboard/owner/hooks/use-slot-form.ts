"use client";
import { useEffect, useState } from "react";
import { createSlots, deleteSlot, findAvailableSlots, isSlotBatch, type Slot } from "@/services/slot";
import type { ProfessionalResponseDto } from "@/services/professional";

export function useSlotForm(professional: ProfessionalResponseDto) {
    const timeText = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [time, setTime] = useState("09:00");
    const [pendingTimes, setPendingTimes] = useState<string[]>([]);
    const [existing, setExisting] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await findAvailableSlots(professional.id, date);
                if (!cancelled) setExisting(data);
            } catch {
                if (!cancelled) setError("Não consegui carregar os horários existentes.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [professional.id, date]);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            setExisting(await findAvailableSlots(professional.id, date));
        } catch {
            setError("Não consegui carregar os horários existentes.");
        } finally {
            setLoading(false);
        }
    };

    const addTime = () => {
        if (!time || pendingTimes.includes(time)) return;
        setPendingTimes((prev) => [...prev, time].sort());
    };

    const removeTime = (t: string) => setPendingTimes((prev) => prev.filter((item) => item !== t));

    const submit = async () => {
        if (!pendingTimes.length) return;
        setSaving(true);
        setError(null);
        setFeedback(null);
        try {
            const isoTimes = pendingTimes.map((t) => new Date(`${date}T${t}:00`).toISOString());
            const result = await createSlots(professional.id, isoTimes);
            if (isSlotBatch(result)) {
                setFeedback(
                    `Criados: ${result.created.length}` +
                    (result.skipped.length
                        ? ` · Ignorados: ${result.skipped.length} (${result.skipped.map((s) => s.reason).join(", ")})`
                        : ""),
                );
            } else {
                setFeedback("Horário criado.");
            }
            setPendingTimes([]);
            await refresh();
        } catch {
            setError("Não consegui criar os horários.");
        } finally {
            setSaving(false);
        }
    };

    const removeExisting = async (id: string) => {
        try {
            await deleteSlot(id);
            await refresh();
        } catch {
            setError("Não consegui remover esse horário.");
        }
    };

    return {
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
    };
}