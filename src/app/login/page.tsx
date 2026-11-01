import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/AuthLayout";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ senha?: string; error?: string }>;
}) {
  const { senha, error } = await searchParams;
  const notice =
    senha === "redefinida"
      ? "Senha alterada. Entre com a nova senha."
      : error === "google"
        ? "Não foi possível entrar com o Google. Tente novamente ou use seu e-mail."
        : undefined;

  return (
    <AuthLayout>
      <LoginForm notice={notice} />
    </AuthLayout>
  );
}
