import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/AuthLayout";
import { PasswordResetForm } from "@/features/auth/PasswordResetForm";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function EsqueciSenhaPage() {
  return (
    <AuthLayout>
      <PasswordResetForm />
    </AuthLayout>
  );
}
