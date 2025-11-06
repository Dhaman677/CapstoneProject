// web/src/auth/useAuth.ts
import { useAtom } from "jotai";
import { userAtom } from "./store";
import type { UserState } from "./store";
import { setAccessToken, api } from "../lib/api";

type JwtPayload = { sub: string; role: "Admin" | "Editor" | "Viewer"; perms?: string[] };

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);

  const parse = (token: string): JwtPayload => {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    const p = parse(data.accessToken);
    setUser({ id: p.sub, role: p.role, perms: p.perms } satisfies UserState as UserState);
  };

  const refresh = async () => {
    const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
    setAccessToken(data.accessToken);
    const p = parse(data.accessToken);
    setUser({ id: p.sub, role: p.role, perms: p.perms });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken("");
    setUser(null);
  };

  const can = (perm: string) => Boolean(user?.perms?.includes(perm));

  return { user, login, refresh, logout, can };
}
