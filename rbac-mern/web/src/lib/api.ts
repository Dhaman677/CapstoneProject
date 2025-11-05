import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000", // match your API port
  withCredentials: true,            // send refresh cookie on /auth/refresh
});

// in-memory access token
let accessToken = "";

export function setAccessToken(token: string) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// simple 401 → refresh → retry once
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original.__retried) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post("/auth/refresh");
          setAccessToken(data.accessToken);
          queue.forEach((fn) => fn());
          queue = [];
        } catch {
          // refresh failed: force logout in caller
        } finally {
          isRefreshing = false;
        }
      }
      original.__retried = true;
      return new Promise((resolve, reject) => {
        queue.push(() =>
          api(original).then(resolve).catch(reject)
        );
      });
    }
    return Promise.reject(err);
  }
);
