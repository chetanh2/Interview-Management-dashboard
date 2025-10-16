// import Link from "next/link";
// import { cookies } from "next/headers";

// type Role = "admin" | "ta_member" | "panelist";

// async function fetchCandidates() {
//   // Fetch directly from DummyJSON (server-side). No CORS issue on server.
//   const res = await fetch("https://dummyjson.com/users?limit=20&skip=0", {
//     cache: "no-store",
//   });
//   if (!res.ok) return [];
//   const data = await res.json();
//   return data.users || [];
// }

// export default async function CandidatesListPage() {
//   const role = (cookies().get("role")?.value ?? "panelist") as Role;
//   const users = await fetchCandidates();

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-semibold mb-4">Candidate List</h1>

//       {users.length === 0 ? (
//         <div className="text-sm text-gray-600">No candidates found.</div>
//       ) : (
//         <div className="grid gap-3">
//           {users.map((u: any) => (
//             <div
//               key={u.id}
//               className="flex items-center justify-between rounded-md shadow-lg drop-shadow-md border p-3 bg-white"
//             >
//               <div>
//                 <div className="font-medium">
//                   {u.firstName} {u.lastName}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   {u?.company?.title ?? "—"} · {u?.company?.department ?? "—"}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {u.email} · {u.phone}
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Link
//                   href={`/candidates/${u.id}`}
//                   className="px-3 py-1 rounded bg-brand-lavender text-brand-gray hover:shadow transition"
//                 >
//                   View Details
//                 </Link>

//                 {(role === "admin" || role === "panelist") && (
//                   <Link
//                     href={`/candidates/${u.id}?tab=feedback`}
//                     className="px-3 py-1 rounded bg-brand-green text-white hover:shadow-lg transition"
//                   >
//                     Submit Feedback
//                   </Link>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
// If you still keep a demo role in lib/data you can use it; otherwise pass role from a server wrapper.
import { role as demoRole } from "@/lib/data";
import { useEffect, useMemo, useState } from "react";

type Role = "admin" | "ta_member" | "panelist";

type Row = {
  id: number;
  name: string;
  department: string;
  title: string;            // job title
  interviewStatus: "Scheduled" | "Completed" | "No-show" | "On hold";
  email: string;
  phone: string;
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Department", accessor: "department" },
  { header: "Role", accessor: "title" },
  { header: "Status", accessor: "interviewStatus" },
  { header: "Actions", accessor: "action" },
];

async function fetchCandidates(opts: { q: string; limit: number; skip: number }) {
  const { q, limit, skip } = opts;
  const base = "https://dummyjson.com";
  const path = q
    ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `/users?limit=${limit}&skip=${skip}`;

  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error("Failed to fetch candidates");
  const data = await res.json();

  const rows: Row[] = (data.users || []).map((u: any) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`.trim(),
    department: u?.company?.department || "—",
    title: u?.company?.title || "—",
    interviewStatus: ["Scheduled", "Completed", "No-show", "On hold"][u.id % 4] as Row["interviewStatus"],
    email: u?.email || "—",
    phone: u?.phone || "—",
  }));

  return { rows, total: data.total ?? rows.length };
}

const CandidateListPage = () => {
  // If you don’t keep demoRole, read it in a server wrapper and pass as prop.
  const role: Role = (demoRole as Role) || "panelist";

  // table data + server pagination
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const skip = (page - 1) * limit;

  // controls
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [title, setTitle] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<keyof Row>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

  // fetch
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { rows, total } = await fetchCandidates({ q: search, limit, skip });
        if (mounted) {
          setRows(rows);
          setTotal(total);
        }
      } catch (e) {
        console.error(e);
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
  }, [search, limit, skip]);

  // derived filters
  const depOptions = useMemo(() => ["all", ...uniq(rows.map(r => r.department))], [rows]);
  const titleOptions = useMemo(() => ["all", ...uniq(rows.map(r => r.title))], [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const depOk = department === "all" || r.department === department;
      const roleOk = title === "all" || r.title === title;
      const stOk = status === "all" || r.interviewStatus === status;
      return depOk && roleOk && stOk;
    });
  }, [rows, department, title, status]);

  const sorted = useMemo(() => {
    const out = [...filtered];
    out.sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return out;
  }, [filtered, sortKey, sortDir]);

  const canFeedback = role === "admin" || role === "panelist";

  const renderRow = (item: Row) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-50"
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Image src={`https://i.pravatar.cc/40?img=${item.id}`} alt="" width={28} height={28} className="rounded-full" />
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-gray-500">{item.email}</span>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap">{item.department}</td>
      <td className="whitespace-nowrap">{item.title}</td>
      <td className="whitespace-nowrap">
        <span
          className={`text-xs px-2 py-1 rounded
            ${item.interviewStatus === "Completed" ? "bg-green-100 text-green-700" :
              item.interviewStatus === "Scheduled" ? "bg-sky-100 text-sky-700" :
              item.interviewStatus === "No-show" ? "bg-pink-100 text-pink-700" :
              "bg-yellow-100 text-yellow-700"}`}
        >
          {item.interviewStatus}
        </span>
      </td>
      <td className="w-[240px]">
        <div className="flex items-center gap-2">
          <Link
            href={`/candidates/${item.id}`}
            className="px-3 py-1 rounded bg-brand-lavender text-brand-gray hover:shadow transition"
          >
            View Details
          </Link>
          {canFeedback && (
            <Link
              href={`/candidates/${item.id}?tab=feedback`}
              className="px-3 py-1 rounded bg-brand-green text-white hover:shadow-lg transition"
            >
              Submit Feedback
            </Link>
          )}
        </div>
      </td>
    </tr>
  );

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Candidates</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* If your TableSearch supports onChange/onSearch, wire it here; else replace with input */}
          {/* <TableSearch onChange={(v) => { setPage(1); setSearch(v); }} /> */}
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search name / email / phone"
              className="border rounded px-3 py-2 w-[240px]"
            />
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-yellow hover:shadow"
              title="Filters"
            >
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-yellow hover:shadow"
              title="Sort"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select
          className="border rounded px-3 py-2"
          value={department}
          onChange={(e) => { setPage(1); setDepartment(e.target.value); }}
        >
          {depOptions.map((o) => <option key={o} value={o}>{o === "all" ? "All Departments" : o}</option>)}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={title}
          onChange={(e) => { setPage(1); setTitle(e.target.value); }}
        >
          {titleOptions.map((o) => <option key={o} value={o}>{o === "all" ? "All Roles" : o}</option>)}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value); }}
        >
          {["all", "Scheduled", "Completed", "No-show", "On hold"].map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as keyof Row)}
        >
          <option value="name">Sort: Name</option>
          <option value="department">Sort: Department</option>
          <option value="title">Sort: Role</option>
          <option value="interviewStatus">Sort: Status</option>
        </select>
      </div>

      {/* LIST (Table) */}
      <div className="mt-3">
        <Table columns={columns} renderRow={renderRow} data={sorted} />
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page} / {pages} • Showing {Math.min(limit, total - skip)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <select
            className="px-2 py-1 border rounded"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Keep your existing Pagination component if it renders page numbers; optional */}
      {/* <Pagination /> */}
    </div>
  );
};

export default CandidateListPage;

function uniq(arr: string[]) {
  return [...new Set(arr.filter(Boolean))];
}
