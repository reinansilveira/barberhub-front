import { NextResponse } from "next/server";
import { serverApi } from "@/services/api/server";
import type { Slot } from "@/services/slot";

function datesFrom(start: string, days: number) {
  const date = new Date(`${start}T12:00:00Z`);

  return Array.from({ length: days }, (_, index) => {
    const current = new Date(date);
    current.setUTCDate(date.getUTCDate() + index);
    return current.toISOString().slice(0, 10);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const professionalId = searchParams.get("professionalId");
  const start = searchParams.get("start");
  const days = Math.min(Math.max(Number(searchParams.get("days") ?? 42), 1), 62);

  if (!professionalId || !start) {
    return NextResponse.json(
      { message: "professionalId e start são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    const result = await Promise.allSettled(
      datesFrom(start, days).map(async (date) => ({
        date,
        slots: await serverApi<Slot[]>({
          url: "/slots",
          params: { professionalId, date },
        }),
      })),
    );

    const availableDates = result.flatMap((item) =>
      item.status === "fulfilled" && item.value.slots.length ? [item.value.date] : [],
    );

    return NextResponse.json(
      { availableDates },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Erro ao buscar disponibilidade." },
      { status: 500 },
    );
  }
}