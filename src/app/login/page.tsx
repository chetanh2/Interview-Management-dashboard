

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { roleHome, Role } from "@/lib/roles";
// import Image from "next/image";


// const LoginPage = ()=> {
//   const router = useRouter();
//   const [form, setForm] = useState({ username: "", password: "", role: "admin" as Role });
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || "Login failed");
//       router.replace(roleHome[form.role]); // redirect based on selected role
//     } catch (e: any) {
//       setErr(e.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="mx-auto max-w-sm p-2" >
//       <Image className="ml-auto" src="/elyx_digital_logo-full.jpg" alt="logo" width={100} height={200} />
//       <div className="p-4 mt-3 rounded-lg" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 8px" }}>
//       <h1 className="text-2xl font-semibold mb-4">Login</h1>

//         <form onSubmit={onSubmit} className="space-y-4 " >
//           <div>
//             <label className="block text-sm mb-1">Username</label>
//             <input
//               className="w-full rounded-md border p-2 border-gray-300"
//               value={form.username}
//               onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
//               placeholder="e.g. kminchelle"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full rounded-md border p-2 border-gray-300"
//               value={form.password}
//               onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Role</label>
//             <select
//               className="w-full rounded-md border p-2 border-gray-300"
//               value={form.role}
//               onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
//             >
//               <option value="admin">admin</option>
//               <option value="ta_member">ta_member</option>
//               <option value="panelist">panelist</option>
//             </select>
//           </div>

//           {err && <p className="text-red-600 text-sm">{err}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
//           >
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>

//         <p className="text-xs text-gray-500 mt-4">
//           Uses DummyJSON <code>/auth/login</code>. This is a demo—don’t use real credentials.
//         </p>
//       </div>
//     </main>
//   );
// }
// export default LoginPage

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { roleHome, Role } from "@/lib/roles";
import Image from "next/image";

type FormState = { username: string; password: string; role: Role };

const DEMOS: Array<{ label: string; username: string; password: string }> = [
  // ✅ Valid DummyJSON demo users
  // { label: "kminchelle", username: "kminchelle", password: "0lelplR" },
  // { label: "emilys",     username: "emilys",     password: "emilyspass" },
  // { label: "atuny0",     username: "atuny0",     password: "9uQFF1Lh" },
    { username: "admin",      password: "1234", label: "Admin" },
  { username: "teamMember", password: "1234", label: "Team Mem" },
  { username: "panel",      password: "1234", label: "Panellist" },
];


export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const targetPath = useMemo(() => roleHome[form.role], [form.role]);

  const autofill = (u: string, p: string) =>
    setForm((f) => ({ ...f, username: u, password: p }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    const payload = {
      username: form.username.trim(),
      password: form.password, // don’t trim passwords
      role: form.role,
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: We push the selected role to the server so it can set role cookies
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Login failed");

      // Redirect to the chosen role’s dashboard
      router.replace(targetPath);
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-sm p-2">
      <Image
        className="ml-auto"
        src="/elyx_digital_logo-full.jpg"
        alt="logo"
        width={100}
        height={200}
      />
      <div
        className="p-4 mt-3 rounded-lg"
        style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 8px" }}
      >
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        {/* Quick-fill demo creds */}
        <div className="flex flex-wrap gap-2 mb-3">
          {DEMOS.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => autofill(d.username, d.password)}
              className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
              title={`Use ${d.username}/${d.password}`}
            >
              Demo: {d.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full rounded-md border p-2 border-gray-300"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder="e.g. kminchelle"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md border p-2 border-gray-300"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
              autoComplete="current-password"
              inputMode="text"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Role (for testing)</label>
            <select
              className="w-full rounded-md border p-2 border-gray-300"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value as Role }))
              }
            >
              <option value="admin">admin</option>
              <option value="ta_member">ta_member</option>
              <option value="panelist">panelist</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You will be redirected to: <code>{targetPath}</code>
            </p>
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Uses DummyJSON <code>/auth/login</code>. This is a demo—don’t use real credentials.
        </p>
      </div>
    </main>
  );
}
