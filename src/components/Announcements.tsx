// const Announcements = () => {
//   return (
//     <div className="bg-white p-4 rounded-md">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Announcements</h1>
//         <span className="text-xs text-gray-400">View All</span>
//       </div>
//       <div className="flex flex-col gap-4 mt-4">
//         <div className="bg-lamaSkyLight rounded-md p-4">
//           <div className="flex items-center justify-between">
//             <h2 className="font-medium">Lorem ipsum dolor sit</h2>
//             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//               2025-01-01
//             </span>
//           </div>
//           <p className="text-sm text-gray-400 mt-1">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
//             expedita. Rerum, quidem facilis?
//           </p>
//         </div>
//         <div className="bg-lamaPurpleLight rounded-md p-4">
//           <div className="flex items-center justify-between">
//             <h2 className="font-medium">Lorem ipsum dolor sit</h2>
//             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//               2025-01-01
//             </span>
//           </div>
//           <p className="text-sm text-gray-400 mt-1">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
//             expedita. Rerum, quidem facilis?
//           </p>
//         </div>
//         <div className="bg-lamaYellowLight rounded-md p-4">
//           <div className="flex items-center justify-between">
//             <h2 className="font-medium">Lorem ipsum dolor sit</h2>
//             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//               2025-01-01
//             </span>
//           </div>
//           <p className="text-sm text-gray-400 mt-1">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
//             expedita. Rerum, quidem facilis?
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Announcements;


// components/Announcements.tsx
"use client";

import type { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";

type Props = {
  filters?: Filters;
};

type Ann = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  role?: "admin" | "ta_member" | "panelist";
  interviewer?: string; // e.g. "u1"
  tone?: "sky" | "purple" | "yellow";
};

// Mock data — align interviewer ids with your FilterBar options
const ALL_ANNOUNCEMENTS: Ann[] = [
  {
    id: 1,
    title: "TA pipeline frozen on Friday",
    date: "2025-10-15",
    description: "Maintenance window 6–8 PM. Interviews after 8 PM only.",
    role: "ta_member",
    interviewer: "u2",
    tone: "purple",
  },
  {
    id: 2,
    title: "Panel calibration - Round 2",
    date: "2025-10-16",
    description: "Deep dive on frontend rubric and scoring consistency.",
    role: "panelist",
    interviewer: "u1",
    tone: "sky",
  },
  {
    id: 3,
    title: "Monthly hiring review",
    date: "2025-10-18",
    description: "Targets, funnel, and no-show analysis.",
    role: "admin",
    interviewer: "u3",
    tone: "yellow",
  },
];

function isWithinRange(dateStr: string, from?: string, to?: string) {
  if (!from && !to) return true;
  const d = new Date(dateStr).setHours(0, 0, 0, 0);
  const f = from ? new Date(from).setHours(0, 0, 0, 0) : undefined;
  const t = to ? new Date(to).setHours(0, 0, 0, 0) : undefined;
  if (f && d < f) return false;
  if (t && d > t) return false;
  return true;
}

const toneCls: Record<NonNullable<Ann["tone"]>, string> = {
  sky: "bg-lamaSkyLight",
  purple: "bg-lamaPurpleLight",
  yellow: "bg-lamaYellowLight",
};

export default function Announcements({ filters }: Props) {
  const filtered = ALL_ANNOUNCEMENTS.filter((a) => {
    const roleOk =
      !filters?.role || filters.role === "all" || a.role === filters.role;
    const interviewerOk =
      !filters?.interviewer ||
      filters.interviewer === "all" ||
      a.interviewer === filters.interviewer;
    const dateOk = isWithinRange(a.date, filters?.from, filters?.to);
    return roleOk && interviewerOk && dateOk;
  });

  return (
    <div
  className="bg-white rounded-xl w-full h-full p-4"
  // style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 4px" }}
  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 6px" }}
>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-400 border rounded-md p-4">
            No announcements match the selected filters.
          </div>
        )}

        {filtered.map((a) => (
          <div
            key={a.id}
            className={`${toneCls[a.tone ?? "sky"]} rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{a.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {a.date}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
