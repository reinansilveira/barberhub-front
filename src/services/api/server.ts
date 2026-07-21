import axios, { type AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

const apiBaseUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:3000";

export async function serverApi<T>(config: AxiosRequestConfig): Promise<T> {
  const token = (await cookies()).get("barberhub_access_token")?.value;
  const { data } = await axios.request<T>({
    baseURL: apiBaseUrl,
    ...config,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...config.headers,
    },
  });
  
  return data;
}
