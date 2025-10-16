"use client";

import { ReactNode } from "react";
import { Permission, Role, can, currentRole } from "@/lib/permissions";

// Hide whole subtree unless user is one of these roles
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const role = currentRole();
  return roles.includes(role) ? <>{children}</> : null;
}

// Hide whole subtree unless user has a permission
export function RequirePerm({ perm, children }: { perm: Permission; children: ReactNode }) {
  const role = currentRole();
  return can(role, perm) ? <>{children}</> : null;
}

// Show but disabled (for toolbars/buttons)
export function LockIfNoPerm({
  perm, children, reason = "Not permitted",
}: { perm: Permission; children: (disabled: boolean) => ReactNode; reason?: string }) {
  const role = currentRole();
  const allowed = can(role, perm);
  return <div title={!allowed ? reason : undefined}>{children(!allowed)}</div>;
}
