import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API ??
    "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((item) => item.startsWith("barberhub_access_token="))
      ?.split("=")[1];
    if (token)
      config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  }
  return config;
});
