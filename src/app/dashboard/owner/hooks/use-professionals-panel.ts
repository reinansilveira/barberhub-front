"use client";
import { useEffect, useMemo, useState } from "react";
import {
    createProfessional,
    deactivateProfessional,
    findAllProfessionals,
    type ProfessionalResponseDto,
} from "@/services/professional";
import { createUser, generateTempPassword } from "@/services/user";
import { apiErrorMessage } from "@/services/api/api-error";

const emptyProfessionalForm = {
    name: "",
    email: "",
    phone: "",
    specialty: "",
    bio: "",
    experience: "",
    commission: "",
};

type ProfessionalForm = typeof emptyProfessionalForm;

interface CreatedCredentials {
    email: string;
    password: string;
}

export function useProfessionalsPanel() {
    const [list, setList] = useState<ProfessionalResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [form, setForm] = useState<ProfessionalForm>(emptyProfessionalForm);
    const [saving, setSaving] = useState(false);
    const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null);
    const [slotsFor, setSlotsFor] = useState<ProfessionalResponseDto | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await findAllProfessionals();
                if (!cancelled) setList(data);
            } catch (err) {
                if (!cancelled) setError(apiErrorMessage(err, "Não consegui carregar os profissionais."));
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
            setList(await findAllProfessionals());
        } catch (err) {
            setError(apiErrorMessage(err, "Não consegui carregar os profissionais."));
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter(
            (p) =>
                p.user.name.toLowerCase().includes(q) ||
                (p.specialty ?? "").toLowerCase().includes(q),
        );
    }, [list, query]);

    const updateForm = (field: keyof ProfessionalForm, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) return;
        setSaving(true);
        setError(null);
        setCreatedCreds(null);
        try {
            const password = generateTempPassword();
            const user = await createUser({
                name: form.name.trim(),
                email: form.email.trim(),
                password,
                phone: form.phone.trim() || undefined,
                role: "PROFESSIONAL",
            });

            await createProfessional({
                userId: user.id,
                specialty: form.specialty.trim() || undefined,
                bio: form.bio.trim() || undefined,
                experience: form.experience ? Number(form.experience) : undefined,
                commission: form.commission ? Number(form.commission) : undefined,
            });

            setCreatedCreds({ email: user.email, password });
            setForm(emptyProfessionalForm);
            await refresh();
        } catch (err) {
            setError(apiErrorMessage(err, "Não consegui cadastrar o profissional."));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Desativar esse profissional?")) return;
        setError(null);
        try {
            await deactivateProfessional(id);
            await refresh();
        } catch (err) {
            setError(apiErrorMessage(err, "Não consegui desativar esse profissional."));
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
        createdCreds,
        slotsFor,
        setSlotsFor,
        filtered,
        submit,
        remove,
    };
}