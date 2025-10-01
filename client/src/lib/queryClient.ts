import { QueryClient, type QueryFunctionContext } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

export function buildApiUrl(url: string): string {
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
  const fullUrl = buildApiUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

async function defaultQueryFn({ queryKey }: QueryFunctionContext) {
  const [url] = queryKey;
  if (typeof url !== "string") {
    throw new Error("Query keys must start with the request path string.");
  }

  const res = await apiRequest("GET", url);
  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
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
