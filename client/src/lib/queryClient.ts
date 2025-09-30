import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

function buildUrl(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }
  const suffix = url.startsWith("/") ? url : `/${url}`;
  if (!API_BASE_URL) {
    return suffix;
  }
  return `${API_BASE_URL}${suffix}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
