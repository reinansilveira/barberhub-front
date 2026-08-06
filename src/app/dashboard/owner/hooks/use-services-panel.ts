"use client";
import { useEffect, useMemo, useState } from "react";
import { createService, deactivateService, findServices, type Service } from "@/services/service";

const emptyServiceForm = { name: "", price: "", duration: "", category: "", description: "" };
type ServiceForm = typeof emptyServiceForm;

export function useServicesPanel() {
    const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const [list, setList] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [form, setForm] = useState<ServiceForm>(emptyServiceForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await findServices();
                if (!cancelled) setList(data);
            } catch {
                if (!cancelled) setError("Não consegui carregar os serviços.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            setList(await findServices());
        } catch {
            setError("Não consegui carregar os serviços.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter(
            (s) => s.name.toLowerCase().includes(q) || (s.category ?? "").toLowerCase().includes(q),
        );
    }, [list, query]);

    const updateForm = (field: keyof ServiceForm, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) return;
        setSaving(true);
        setError(null);
        try {
            await createService({
                name: form.name.trim(),
                price: Number(form.price),
                duration: form.duration ? Number(form.duration) : undefined,
                category: form.category.trim() || undefined,
                description: form.description.trim() || undefined,
            });
            setForm(emptyServiceForm);
            await refresh();
        } catch {
            setError("Não consegui cadastrar o serviço. Confere os campos e tenta de novo.");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Desativar esse serviço?")) return;
        try {
            await deactivateService(id);
            await refresh();
        } catch {
            setError("Não consegui desativar esse serviço.");
        }
    };

    return {
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
    };
}