import { serverApi } from "@/services/api/server";
import { cookies } from "next/headers";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { CurrentUser, OwnerDashboardData, Payment, Review } from "./owner.types";

export async function getOwnerDashboardData(): Promise<OwnerDashboardData> {
  const [appointments, services, payments, reviews, currentUser] = await Promise.all([
    serverApi<Appointment[]>({ url: "/appointments" }).catch(() => []),
    serverApi<Service[]>({ url: "/services" }).catch(() => []),
    serverApi<Payment[]>({ url: "/payments?status=PAID" }).catch(() => []),
    serverApi<Review[]>({ url: "/reviews" }).catch(() => []),
    getCurrentUser().catch(() => ({ id: "", name: "Usuário", email: null, avatar: null, role: "" })),
  ]);

  return { appointments, services, payments, reviews, currentUser };
}

async function getCurrentUser(): Promise<CurrentUser> {
  const token = (await cookies()).get("barberhub_access_token")?.value;
  const payload = JSON.parse(
    Buffer.from(token?.split(".")[1] ?? "", "base64url").toString("utf8")
  ) as { sub?: string; email?: string; accountType?: "USER" | "CLIENT" };

  if (!payload.sub) throw new Error("Sessão sem identificador");

  if (payload.accountType === "CLIENT") {
    const client = await serverApi<{ name: string }>({ url: `/clients/${payload.sub}` });
    return {
      id: payload.sub,
      name: client.name,
      email: null,
      avatar: null,
      role: "CLIENT",
    };
  }

  try {
    return await serverApi<CurrentUser>({ url: `/users/${payload.sub}` });
  } catch {
    const users = await serverApi<CurrentUser[]>({ url: "/users" });
    const user = users.find((item) => item.id === payload.sub || item.email === payload.email);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }
}
