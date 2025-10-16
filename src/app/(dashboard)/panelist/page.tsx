"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
const PanelistDashboard = () => {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Panelist Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Only accessible to <b>panelist</b>.
      </p>
      <button
        onClick={logout}
        className="mt-6 rounded bg-black text-white px-4 py-2"
      >
        Logout
      </button>
      <Link
        href="/candidates"
        className="ml-4 inline-block rounded bg-brand-green hover:bg-green-500 text-white px-4 py-2 hover:shadow transition"
      >
        Go to Candidates
      </Link>
    </main>
  );
};

export default PanelistDashboard;
