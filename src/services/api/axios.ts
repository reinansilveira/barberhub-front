import axios from "axios";

const serverBaseUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:3000";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    // rodando no servidor: precisa de URL absoluta e ler o cookie httpOnly
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get("barberhub_access_token")?.value;

    config.baseURL = serverBaseUrl;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // rodando no browser: continua indo pelo proxy relativo
    config.baseURL = "/api/backend";
  }

  return config;
});