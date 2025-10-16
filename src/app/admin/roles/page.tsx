// ❌ REMOVE "use client" — this is a SERVER component
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminRolesInner from "./AdminRolesInner";

export default function RoleManagementPage() {
  const role = cookies().get("role")?.value; // HttpOnly cookie works server-side

  if (role !== "admin") {
    // you can show a message instead, but redirect keeps things consistent
    redirect("/login");
  }

  // Only admins make it here
  return  <Suspense fallback={<div>Loading…</div>}>
      <AdminRolesInner />
    </Suspense>
}
