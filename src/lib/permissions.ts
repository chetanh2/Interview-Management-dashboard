// src/lib/permissions.ts
export type Role = "admin" | "ta_member" | "panelist";

export type Permission =
  | "candidates:view"
  | "feedback:view"
  | "feedback:submit"     // only panelist, by default
  | "roles:manage";       // only admin

// Default role → permissions
export const ROLE_PERMS: Record<Role, Permission[]> = {
  admin:     ["candidates:view", "feedback:view", "roles:manage"],  // admin can’t submit feedback (your spec)
  ta_member: ["candidates:view", "feedback:view"],
  panelist:  ["candidates:view", "feedback:view", "feedback:submit"],
};

// ---- mock “DB” overrides (persisted in localStorage) ----
const LP_KEY = "mock_role_perm_overrides";
export function loadOverrides(): Partial<Record<Role, Permission[]>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LP_KEY) || "{}") || {};
  } catch { return {}; }
}
export function saveOverrides(o: Partial<Record<Role, Permission[]>>) {
  if (typeof window !== "undefined") localStorage.setItem(LP_KEY, JSON.stringify(o));
}

export function effectivePerms(role: Role): Permission[] {
  const overrides = loadOverrides();
  return overrides[role] ?? ROLE_PERMS[role];
}

// Simple cookie reader for client components
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return;
  return document.cookie
    .split("; ")
    .map(p => p.split("="))
    .find(([k]) => k === name)?.[1];
}

// Current user role (from cookie set at login)
// lib/permissions.ts
export function currentRole(): "admin" | "ta_member" | "panelist" {
  if (typeof document === "undefined") return "panelist"; // fallback
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("role_ui="));
  return (match?.split("=")[1] as any) || "panelist";
}


export function can(role: Role, perm: Permission) {
  return effectivePerms(role).includes(perm);
}
