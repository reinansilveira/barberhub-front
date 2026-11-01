import axios from "axios";
import { ACCESS_TOKEN_COOKIE, API_BASE_URL, API_PROXY_PATH } from "./config";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

    config.baseURL = API_BASE_URL;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    config.baseURL = API_PROXY_PATH;
  }

  return config;
});

publicApi.interceptors.request.use((config) => {
  config.baseURL =
    typeof window === "undefined" ? API_BASE_URL : API_PROXY_PATH;
  return config;
});
