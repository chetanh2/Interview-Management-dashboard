"use client";

import { useMemo } from "react";
import { useFilters } from "./FiltersProvider";

type Props = {
  interviewers?: { id: string; name: string }[];
};

export default function FilterBar({ interviewers = [] }: Props) {
  const { filters, setFilters } = useFilters();

  const interviewerOptions = useMemo(
    () => [{ id: "all", name: "All interviewers" }, ...interviewers],
    [interviewers]
  );

  return (
    <div className="w-full bg-white border rounded-xl p-3 mb-4 flex flex-col lg:flex-row gap-3 items-start lg:items-end">
      {/* Role */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Role</label>
        <select
          className="border border-gray-300 rounded-xl px-3 py-2 min-w-[180px]"
          value={filters.role}
          onChange={(e) => setFilters({ role: e.target.value as any })}
        >
          <option className="rouned-xl" value="all">
            All roles
          </option>
          <option className="rouned-xl" value="admin">
            Admin
          </option>
          <option className="rouned-xl" value="ta_member">
            TA Member
          </option>
          <option className="rouned-xl" value="panelist">
            Panelist
          </option>
        </select>
      </div>

      {/* Interviewer */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Interviewer</label>
        <select
          className="border border-gray-300 rounded-xl px-3 py-2 min-w-[220px]"
          value={filters.interviewer}
          onChange={(e) => setFilters({ interviewer: e.target.value })}
        >
          {interviewerOptions.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date range */}
      <div className="flex gap-3">
        <div className="flex flex-col">
          <label className="text-sm mb-1">From</label>
          <input
            type="date"
            className="border border-gray-300 rounded-xl px-3 py-2"
            value={filters.from}
            onChange={(e) => setFilters({ from: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">To</label>
          <input
            type="date"
            className="border border-gray-300 rounded-xl px-3 py-2"
            value={filters.to}
            onChange={(e) => setFilters({ to: e.target.value })}
          />
        </div>
      </div>

      {/* Clear */}
      {/* <button
        className=" ml-5 mb-1 bg-gray-300 hover:bg-black hover:text-white text-sm px-3 py-2 rounded"
        onClick={() => setFilters({ role: "all", interviewer: "all", from: "", to: "" })}
      >
        Clear
      </button> */}
      <button
        className="
    ml-5 mb-1 
    bg-brand-purple text-white 
    px-4 py-2 text-sm font-medium 
    rounded-md 
    shadow-sm
    transition-all duration-300 
    hover:bg-brand-green hover:shadow-lg hover:scale-[1.03]
    active:scale-[0.98]
  "
        onClick={() =>
          setFilters({ role: "all", interviewer: "all", from: "", to: "" })
        }
      >
        Clear Filters
      </button>
    </div>
  );
}
