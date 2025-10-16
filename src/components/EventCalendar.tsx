// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];

// // TEMPORARY
// const events = [
//   {
//     id: 1,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 2,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 3,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
// ];

// const EventCalendar = () => {
//   const [value, onChange] = useState<Value>(new Date());

//   return (
//     <div className="bg-white p-4 rounded-md">
//       <Calendar onChange={onChange} value={value} />
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold my-4">Events</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//       <div className="flex flex-col gap-4">
//         {events.map((event) => (
//           <div
//             className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
//             key={event.id}
//           >
//             <div className="flex items-center justify-between">
//               <h1 className="font-semibold text-gray-600">{event.title}</h1>
//               <span className="text-gray-300 text-xs">{event.time}</span>
//             </div>
//             <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EventCalendar;


// components/EventCalendar.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Props = {
  filters?: Filters; // ✅ accept filters
};

// TEMPORARY mock data
const ALL_EVENTS = [
  {
    id: 1,
    title: "Panel with Sanjay",
    time: "12:00 PM - 2:00 PM",
    description: "Frontend interviews",
    date: "2025-10-14",
    role: "panelist",
    interviewer: "u1",
  },
  {
    id: 2,
    title: "TA sync",
    time: "10:00 AM - 11:00 AM",
    description: "TA pipeline review",
    date: "2025-10-15",
    role: "ta_member",
    interviewer: "u2",
  },
  {
    id: 3,
    title: "Admin standup",
    time: "09:30 AM - 10:00 AM",
    description: "Weekly status",
    date: "2025-10-16",
    role: "admin",
    interviewer: "u3",
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

export default function EventCalendar({ filters }: Props) {
  const [value, onChange] = useState<Value>(new Date());

  // ✅ Apply filters (role, interviewer, date range)
  const events = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      const roleOk =
        !filters?.role || filters.role === "all" || e.role === filters.role;
      const interviewerOk =
        !filters?.interviewer ||
        filters.interviewer === "all" ||
        e.interviewer === filters.interviewer;
      const dateOk = isWithinRange(e.date, filters?.from, filters?.to);
      return roleOk && interviewerOk && dateOk;
    });
  }, [filters]);

  return (
    <div
  className="bg-white rounded-xl w-full h-full p-4"
  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 6px" }}
>
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.length === 0 && (
          <div className="text-sm text-gray-400 border rounded p-4">
            No events match the selected filters.
          </div>
        )}
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-500 text-xs">{event.time}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(event.date).toDateString()}
            </p>
            <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
