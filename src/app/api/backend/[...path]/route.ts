import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/services/api/config";
import { getAccessToken } from "@/services/api/session";

async function forward(req: NextRequest, path: string[]) {
  const token = await getAccessToken();
  const url = `${API_BASE_URL}/${path.join("/")}${req.nextUrl.search}`;

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body || undefined,
    cache: "no-store",
  });

  const text = await res.text();
  const response = new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });

  try {
    const parsed = JSON.parse(text);

    // A criação pública de agendamento pode incluir a sessão do cliente no
    // payload. Nunca deixe essa resposta substituir uma sessão que já está
    // autenticada (por exemplo, a de um administrador criando um horário).
    // Rotas de autenticação continuam podendo renovar/substituir a sessão.
    const shouldPersistSession = path[0] === "auth" || !token;

    if (
      shouldPersistSession &&
      parsed?.session?.access_token &&
      parsed?.session?.refresh_token
    ) {
      response.cookies.set(
        ACCESS_TOKEN_COOKIE,
        parsed.session.access_token,
        SESSION_COOKIE_OPTIONS,
      );
      response.cookies.set(
        REFRESH_TOKEN_COOKIE,
        parsed.session.refresh_token,
        SESSION_COOKIE_OPTIONS,
      );
    }
  } catch {}

  return response;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, (await ctx.params).path);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return forward(req, (await ctx.params).path);
}
