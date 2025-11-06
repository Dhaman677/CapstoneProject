// web/src/auth/store.ts
import { atom } from "jotai";

export type Role = "Admin" | "Editor" | "Viewer";
export type UserState = { id: string; role: Role; perms?: string[] } | null;

// ✅ Writable atom (not derived)
export const userAtom = atom<UserState>(null);
