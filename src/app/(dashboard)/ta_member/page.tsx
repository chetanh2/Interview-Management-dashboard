"use client";

import { useRouter } from "next/navigation";

const TaMemberDashboard = ()=> {
  const router = useRouter();
  const logout = async () => { await fetch("/api/logout", { method: "POST" }); router.replace("/login"); };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">TA Member Dashboard</h1>
      <p className="mt-2 text-gray-600">Only accessible to <b>ta_member</b>.</p>
      <button onClick={logout} className="mt-6 rounded bg-black text-white px-4 py-2">
        Logout
      </button>
    </main>
  );
}
export default TaMemberDashboard;