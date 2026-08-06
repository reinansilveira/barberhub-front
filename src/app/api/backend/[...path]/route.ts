import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiBaseUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:3000";

async function forward(req: NextRequest, path: string[]) {
  const token = (await cookies()).get("barberhub_access_token")?.value;
  const url = `${apiBaseUrl}/${path.join("/")}${req.nextUrl.search}`;

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
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });

  try {
    const parsed = JSON.parse(text);

    if (parsed?.session?.access_token && parsed?.session?.refresh_token) {
      const isProd = process.env.NODE_ENV === "production";

      response.cookies.set("barberhub_access_token", parsed.session.access_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });

      response.cookies.set("barberhub_refresh_token", parsed.session.refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }
  } catch {
  }

  return response;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}