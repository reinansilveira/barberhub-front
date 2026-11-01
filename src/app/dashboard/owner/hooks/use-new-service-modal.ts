import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { apiErrorMessage } from "@/services/api/api-error";
import { createService } from "@/services/service";

export const SERVICE_CATEGORIES = ["Cortes", "Barba", "Combos", "Tratamentos"];

const INITIAL_FORM = {
  name: "",
  description: "",
  price: "",
  duration: "45",
  category: SERVICE_CATEGORIES[0],
};

type ServiceFormField = keyof typeof INITIAL_FORM;

export const parseServicePrice = (price: string) =>
  Number(price.replace(",", "."));

export function useNewServiceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  const updateField = (field: ServiceFormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const price = parseServicePrice(form.price);
    const duration = Number(form.duration);
    if (!form.name.trim() || !price || !duration) {
      setError("Preencha o nome, o preço e a duração do serviço.");
      return;
    }

    setSubmitting(true);
    try {
      await createService({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price,
        duration,
        category: form.category,
      });
      setSuccess(true);
      window.setTimeout(() => {
        setForm(INITIAL_FORM);
        setSuccess(false);
        onClose();
        router.refresh();
      }, 900);
    } catch (requestError) {
      setError(
        apiErrorMessage(requestError, "Não foi possível criar o serviço."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { dialogRef, error, form, submit, submitting, success, updateField };
}
