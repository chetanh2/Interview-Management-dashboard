// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Permission, Role, ROLE_PERMS, effectivePerms, loadOverrides, saveOverrides } from "@/lib/permissions";

// // Mock users list (in real app, fetch from API)
// type User = { id: number; name: string; role: Role };
// const DEFAULT_USERS: User[] = [
//   { id: 1, name: "Alice", role: "admin" },
//   { id: 2, name: "Bob", role: "panelist" },
//   { id: 3, name: "Chinmay", role: "ta_member" },
// ];

// const LU_KEY = "mock_users";

// export default function AdminRolesInner() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [permOverrides, setPermOverrides] = useState<Partial<Record<Role, Permission[]>>>(loadOverrides());

//   // Load mock users
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const raw = localStorage.getItem(LU_KEY);
//     setUsers(raw ? JSON.parse(raw) : DEFAULT_USERS);
//   }, []);

//   // Save mock users
//   useEffect(() => {
//     if (typeof window !== "undefined") localStorage.setItem(LU_KEY, JSON.stringify(users));
//   }, [users]);

//   // Save perm overrides
//   useEffect(() => { saveOverrides(permOverrides); }, [permOverrides]);

//   const allPerms = useMemo<Permission[]>(() => ([
//     "candidates:view", "feedback:view", "feedback:submit", "roles:manage",
//   ]), []);

//   function changeUserRole(id: number, role: Role) {
//     setUsers(prev => prev.map(u => (u.id === id ? { ...u, role } : u)));
//   }

//   function togglePermForRole(role: Role, perm: Permission) {
//     setPermOverrides(prev => {
//       const cur = prev[role] ?? ROLE_PERMS[role];
//       const next = cur.includes(perm) ? cur.filter(p => p !== perm) : [...cur, perm];
//       return { ...prev, [role]: next };
//     });
//   }

//   return (
//     <main className="p-6 space-y-8">
//       <header>
//         <h1 className="text-2xl font-semibold">Role & Permission Management (Mock)</h1>
//         <p className="text-gray-600">
//           Admin-only interface. Changes are stored in <code>localStorage</code>.
//         </p>
//       </header>

//       {/* Users table */}
//       <section className="bg-white border rounded p-4">
//         <h2 className="text-lg font-medium mb-3">Users</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-500 border-b">
//                 <th className="py-2">Name</th>
//                 <th className="py-2">Role</th>
//                 <th className="py-2">Effective Permissions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(u => (
//                 <tr key={u.id} className="border-b">
//                   <td className="py-2">{u.name}</td>
//                   <td className="py-2">
//                     <select
//                       value={u.role}
//                       onChange={e => changeUserRole(u.id, e.target.value as Role)}
//                       className="border rounded px-2 py-1"
//                     >
//                       <option value="admin">admin</option>
//                       <option value="ta_member">ta_member</option>
//                       <option value="panelist">panelist</option>
//                     </select>
//                   </td>
//                   <td className="py-2">
//                     <div className="flex flex-wrap gap-2">
//                       {effectivePerms(u.role).map(p => (
//                         <span key={p} className="text-xs bg-gray-100 rounded px-2 py-1">{p}</span>
//                       ))}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Role → Permission matrix (overrides) */}
//       <section className="bg-white border rounded p-4">
//         <h2 className="text-lg font-medium mb-3">Role Permission Matrix</h2>

//         {(["admin", "ta_member", "panelist"] as Role[]).map((role) => {
//           const eff = effectivePerms(role);
//           return (
//             <div key={role} className="mb-4">
//               <h3 className="font-medium mb-2">{role}</h3>
//               <div className="flex flex-wrap gap-2">
//                 {allPerms.map(p => {
//                   const checked = eff.includes(p);
//                   return (
//                     <label
//                       key={p}
//                       className={`text-xs px-2 py-1 rounded border cursor-pointer ${
//                         checked ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-300"
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => togglePermForRole(role, p)}
//                         className="mr-1 align-middle"
//                       />
//                       {p}
//                     </label>
//                   );
//                 })}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 (Toggling creates an override for this role in <code>localStorage</code>.)
//               </p>
//             </div>
//           );
//         })}
//       </section>
//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Permission,
  Role,
  ROLE_PERMS,
  effectivePerms,
  loadOverrides,
  saveOverrides,
} from "@/lib/permissions";
import { useSearchParams } from "next/navigation";

// Mock users list (in real app, fetch from API)
type User = { id: number; name: string; role: Role };

const DEFAULT_USERS: User[] = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "panelist" },
  { id: 3, name: "Chinmay", role: "ta_member" },
];

const LU_KEY = "mock_users";

export default function AdminRolesInner() {
  const [users, setUsers] = useState<User[]>([]);
  const [permOverrides, setPermOverrides] = useState<
    Partial<Record<Role, Permission[]>>
  >(loadOverrides());
  const searchParams = useSearchParams(); // ✅ now inside Suspense boundary
  const tab = searchParams.get("tab") ?? "overview";
  // --- Load mock users (seed if missing/empty/bad) ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LU_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setUsers(parsed);
      } else {
        localStorage.setItem(LU_KEY, JSON.stringify(DEFAULT_USERS));
        setUsers(DEFAULT_USERS);
      }
    } catch {
      localStorage.setItem(LU_KEY, JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }
  }, []);

  // --- Persist users ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LU_KEY, JSON.stringify(users));
    }
  }, [users]);

  // --- Persist permission overrides ---
  useEffect(() => {
    saveOverrides(permOverrides);
  }, [permOverrides]);

  const allPerms = useMemo<Permission[]>(
    () => ["candidates:view", "feedback:view", "feedback:submit", "roles:manage"],
    []
  );

  // Change a user's role
  function changeUserRole(id: number, role: Role) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  // Toggle a permission for a role (override)
  function togglePermForRole(role: Role, perm: Permission) {
    setPermOverrides((prev) => {
      const cur = prev[role] ?? ROLE_PERMS[role];
      const next = cur.includes(perm) ? cur.filter((p) => p !== perm) : [...cur, perm];
      return { ...prev, [role]: next };
    });
  }

  // --- Utilities ---
  function resetUsers() {
    localStorage.setItem(LU_KEY, JSON.stringify(DEFAULT_USERS));
    setUsers(DEFAULT_USERS);
  }

  function resetPerms() {
    // Clear overrides by saving an empty object
    setPermOverrides({});
  }

  return (
    <main className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          Admin – active tab: {tab}
          <h1 className="text-2xl font-semibold">Role & Permission Management (Mock)</h1>
          <p className="text-gray-600">
            Admin-only interface. Changes are stored in <code>localStorage</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetPerms}
            className="text-sm rounded px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
            title="Clear permission overrides"
          >
            Reset Permissions
          </button>
          <button
            onClick={resetUsers}
            className="text-sm rounded px-3 py-1 bg-gray-900 text-white hover:opacity-90 transition"
            title="Reset mock users to defaults"
          >
            Reset Users
          </button>
        </div>
      </header>

      {/* Users table */}
      <section className="bg-white border rounded p-4">
        <h2 className="text-lg font-medium mb-3">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Effective Permissions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="admin">admin</option>
                      <option value="ta_member">ta_member</option>
                      <option value="panelist">panelist</option>
                    </select>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {effectivePerms(u.role).map((p) => (
                        <span key={p} className="text-xs bg-gray-100 rounded px-2 py-1">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Role → Permission matrix (overrides) */}
      <section className="bg-white border rounded p-4">
        <h2 className="text-lg font-medium mb-3">Role Permission Matrix</h2>

        {(["admin", "ta_member", "panelist"] as Role[]).map((role) => {
          const eff = effectivePerms(role);
          return (
            <div key={role} className="mb-4">
              <h3 className="font-medium mb-2">{role}</h3>
              <div className="flex flex-wrap gap-2">
                {allPerms.map((p) => {
                  const checked = eff.includes(p);
                  return (
                    <label
                      key={p}
                      className={`text-xs px-2 py-1 rounded border cursor-pointer ${
                        checked ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermForRole(role, p)}
                        className="mr-1 align-middle"
                      />
                      {p}
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (Toggling creates an override for this role in <code>localStorage</code>.)
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
