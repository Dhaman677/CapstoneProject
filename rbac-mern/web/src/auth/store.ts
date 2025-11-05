import { atom } from "jotai";

export type UserClaims = {
  id: string;
  role: "Admin" | "Editor" | "Viewer";
  perms: string[];
} | null;

export const userAtom = atom<UserClaims>(null);
