"use client";

import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import Image from "next/image";
import Link from "next/link";
import { role, teachersData } from "@/lib/data";
import { useMemo, useState, useEffect } from "react";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default function TeacherListPage() {
  // ------- state for search + pagination -------
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // (optional) debounce search so typing is smooth
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // ------- filter + paginate on the client -------
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return teachersData;

    return teachersData.filter((t) => {
      const hay = [
        t.name,
        t.email,
        t.teacherId,
        t.phone,
        t.address,
        ...(t.subjects || []),
        ...(t.classes || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [debouncedQuery]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // keep page in range when filtering changes
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ------- row renderer (unchanged) -------
  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes.join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && <FormModal table="teacher" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="hidden md:block text-lg font-semibold">People</h1>

        <div className="flex items-center gap-2">
          {/* If your TableSearch component exposes onChange/onSearch, use it. Otherwise use this input. */}
          <input
            value={query}
            onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            placeholder="Search name, id, email, phone, subject, class…"
            className="border rounded px-3 py-2 w-[260px]"
          />

          {/* Page size */}
          <select
            className="border rounded px-2 py-2"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
            title="Rows per page"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={paginated} />

      {/* PAGINATION (inline controls) */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Page {page}/{totalPages} • Showing {paginated.length} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
