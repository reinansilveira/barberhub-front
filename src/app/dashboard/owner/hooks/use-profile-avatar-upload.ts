import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { apiErrorMessage } from "@/services/api/api-error";
import { updateCurrentUserAvatar } from "@/services/user";
import { prepareAvatar } from "@/utils/avatar";

export function useProfileAvatarUpload(initialAvatar: string) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState(initialAvatar);
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    setIsOpen(false);
    setPreview(null);
    setError("");
  };

  useEscapeKey(close, isOpen);

  const chooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    try {
      setPreview(await prepareAvatar(file));
    } catch (reason) {
      setPreview(null);
      setError(reason instanceof Error ? reason.message : "Imagem inválida.");
    } finally {
      event.target.value = "";
    }
  };

  const save = async () => {
    if (!preview) return;

    setSaving(true);
    setError("");
    try {
      const updated = await updateCurrentUserAvatar(preview);
      setAvatarSrc(updated.avatar || preview);
      close();
      router.refresh();
    } catch (reason) {
      setError(apiErrorMessage(reason, "Não foi possível salvar sua foto."));
    } finally {
      setSaving(false);
    }
  };

  return {
    avatarSrc,
    chooseImage,
    close,
    error,
    fileInputRef,
    isOpen,
    open: () => setIsOpen(true),
    openFilePicker: () => fileInputRef.current?.click(),
    preview,
    save,
    saving,
  };
}
