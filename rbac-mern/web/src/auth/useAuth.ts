import { useAtom } from "jotai";
import { userAtom } from "./store";
import { setAccessToken, api } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
    setUser({ id: payload.sub, role: payload.role, perms: payload.perms });
  };

  const refresh = async () => {
    const { data } = await api.post("/auth/refresh");
    setAccessToken(data.accessToken);
    const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
    setUser({ id: payload.sub, role: payload.role, perms: payload.perms });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken("");
    setUser(null);
  };

  const can = (perm: string) => !!user?.perms?.includes(perm) || false;

  return { user, login, refresh, logout, can };
}
