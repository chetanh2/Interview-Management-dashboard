// "use client";
// import Image from "next/image";
// import {
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   {
//     name: "Total",
//     count: 106,
//     fill: "white",
//   },
//   {
//     name: "Girls",
//     count: 53,
//     fill: "#FAE27C",
//   },
//   {
//     name: "Boys",
//     count: 53,
//     fill: "#C3EBFA",
//   },
// ];

// const CountChart = () => {
//   return (
//     <div className="bg-white rounded-xl w-full h-full p-4">
//       {/* TITLE */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-lg font-semibold">Candidates</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//       {/* CHART */}
//       <div className="relative w-full h-[75%]">
//         <ResponsiveContainer>
//           <RadialBarChart
//             cx="50%"
//             cy="50%"
//             innerRadius="40%"
//             outerRadius="100%"
//             barSize={32}
//             data={data}
//           >
//             <RadialBar background dataKey="count" />
//           </RadialBarChart>
//         </ResponsiveContainer>
//         <Image
//           src="/maleFemale.png"
//           alt=""
//           width={50}
//           height={50}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//         />
//       </div>
//       {/* BOTTOM */}
//       <div className="flex justify-center gap-16">
//         <div className="flex flex-col gap-1">
//           <div className="w-5 h-5 bg-lamaSky rounded-full" />
//           <h1 className="font-bold">1,234</h1>
//           <h2 className="text-xs text-gray-300">Boys (55%)</h2>
//         </div>
//         <div className="flex flex-col gap-1">
//           <div className="w-5 h-5 bg-lamaYellow rounded-full" />
//           <h1 className="font-bold">1,234</h1>
//           <h2 className="text-xs text-gray-300">Girls (45%)</h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountChart;

"use client";
import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import type { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";

const fullData = [
  { name: "Total", count: 96, fill: "#C7C4F5", gender: "total" },
  { name: "Girls", count: 53, fill: "#F9A8D4", gender: "female" },
  { name: "Boys", count: 43, fill: "#93C5FD", gender: "male" },
];

export default function CountChart({ filters }: { filters?: Filters }) {
  // 🧠 Example filtering logic (replace with real data logic)
  let data = [...fullData];

  // Filter by role (for demo, just change counts)
  if (filters?.role && filters.role !== "all") {
    data = data.map((d) => ({
      ...d,
      count: d.count - 10, // pretend fewer candidates for a specific role
    }));
  }

  // Filter by interviewer (simulate different data)
  if (filters?.interviewer && filters.interviewer !== "all") {
    data = data.map((d) => ({
      ...d,
      count: d.count - 5, // simulate difference by interviewer
    }));
  }

  // Filter by date range (simulate trend)
  if (filters?.from && filters?.to) {
    data = data.map((d) => ({
      ...d,
      count: d.count - 3, // pretend narrower date range → fewer candidates
    }));
  }

  return (
    <div
      className="bg-white rounded-xl w-full h-full p-4"
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 6px" }}
    >
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Candidates</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-blue-300 rounded-full shadow-sm" />
          <h1 className="font-bold text-gray-800">
            {data.find((d) => d.gender === "male")?.count}
          </h1>
          <h2 className="text-xs text-gray-600">Boys</h2>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-pink-300 rounded-full shadow-sm" />
          <h1 className="font-bold text-gray-800">
            {data.find((d) => d.gender === "female")?.count}
          </h1>
          <h2 className="text-xs text-gray-600">Girls</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#C7C4F5] rounded-full shadow-sm" />
          <h1 className="font-bold text-gray-800">
            {data.find((d) => d.gender === "total")?.count}
          </h1>
          <h2 className="text-xs text-gray-600">Total</h2>
        </div>
      </div>
    </div>
  );
}
