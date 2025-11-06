// web/src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000", // or 4001 if you changed it
  withCredentials: true,
});

let accessToken = "";
export function setAccessToken(token: string) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err: any) => {
    const original = (err && err.config) || {};
    if (err?.response?.status === 401 && !original.__retried) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post("/auth/refresh");
          setAccessToken(data.accessToken);
          queue.forEach((fn) => fn());
          queue = [];
        } catch {
          // refresh failed; caller should handle logout
        } finally {
          isRefreshing = false;
        }
      }
      original.__retried = true;
      return new Promise((resolve, reject) => {
        queue.push(() => api(original).then(resolve).catch(reject));
      });
    }
    return Promise.reject(err);
  }
);
