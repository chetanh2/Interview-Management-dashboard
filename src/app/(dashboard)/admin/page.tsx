import { Suspense } from "react";
import ClientDashboard from "./ClientDashboard";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <ClientDashboard />
    </Suspense>
  );
}
