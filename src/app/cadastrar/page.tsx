import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/AuthLayout";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
