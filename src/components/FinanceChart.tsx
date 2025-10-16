// "use client";

// import Image from "next/image";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   {
//     name: "Jan",
//     income: 4000,
//     expense: 2400,
//   },
//   {
//     name: "Feb",
//     income: 3000,
//     expense: 1398,
//   },
//   {
//     name: "Mar",
//     income: 2000,
//     expense: 9800,
//   },
//   {
//     name: "Apr",
//     income: 2780,
//     expense: 3908,
//   },
//   {
//     name: "May",
//     income: 1890,
//     expense: 4800,
//   },
//   {
//     name: "Jun",
//     income: 2390,
//     expense: 3800,
//   },
//   {
//     name: "Jul",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Aug",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Sep",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Oct",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Nov",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Dec",
//     income: 3490,
//     expense: 4300,
//   },
// ];

// const FinanceChart = () => {
//   return (
//     <div className="bg-white rounded-xl w-full h-full p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-lg font-semibold">Finance</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//       <ResponsiveContainer width="100%" height="90%">
//         <LineChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
//           <XAxis
//             dataKey="name"
//             axisLine={false}
//             tick={{ fill: "#d1d5db" }}
//             tickLine={false}
//             tickMargin={10}
//           />
//           <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
//           <Tooltip />
//           <Legend
//             align="center"
//             verticalAlign="top"
//             wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
//           />
//           <Line
//             type="monotone"
//             dataKey="income"
//             stroke="#C3EBFA"
//             strokeWidth={5}
//           />
//           <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5}/>
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default FinanceChart;

"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";

// Props
type Props = {
  filters?: Filters;
};

// Mock monthly interview metrics (replace with API data)
const baseData = [
  { name: "Jan", scheduled: 42, completed: 36, offers: 6, rejections: 18 },
  { name: "Feb", scheduled: 38, completed: 31, offers: 5, rejections: 16 },
  { name: "Mar", scheduled: 50, completed: 41, offers: 7, rejections: 19 },
  { name: "Apr", scheduled: 47, completed: 39, offers: 8, rejections: 17 },
  { name: "May", scheduled: 55, completed: 46, offers: 9, rejections: 20 },
  { name: "Jun", scheduled: 49, completed: 40, offers: 7, rejections: 18 },
  { name: "Jul", scheduled: 52, completed: 45, offers: 10, rejections: 17 },
  { name: "Aug", scheduled: 48, completed: 41, offers: 8, rejections: 16 },
  { name: "Sep", scheduled: 51, completed: 44, offers: 9, rejections: 17 },
  { name: "Oct", scheduled: 53, completed: 46, offers: 10, rejections: 18 },
  { name: "Nov", scheduled: 45, completed: 38, offers: 7, rejections: 15 },
  { name: "Dec", scheduled: 40, completed: 33, offers: 6, rejections: 14 },
];

const InterviewsChart = ({ filters }: Props) => {
  // Example filter effects (tweak as needed)
  const data = baseData.map((d) => {
    let { scheduled, completed, offers, rejections } = d;

    // Narrow by role (e.g., fewer interviews when filtering to a specific role)
    if (filters?.role && filters.role !== "all") {
      scheduled = Math.max(0, scheduled - 6);
      completed = Math.max(0, completed - 5);
      offers = Math.max(0, offers - 1);
      rejections = Math.max(0, rejections - 2);
    }

    // Narrow by interviewer
    if (filters?.interviewer && filters.interviewer !== "all") {
      scheduled = Math.max(0, scheduled - 3);
      completed = Math.max(0, completed - 2);
    }

    // Date range selected
    if (filters?.from && filters?.to) {
      // light normalization for demo
      scheduled = Math.max(0, scheduled - 2);
      completed = Math.max(0, completed - 2);
    }

    return { ...d, scheduled, completed, offers, rejections };
  });

  return (
    <div
  className="bg-white rounded-xl w-full h-full p-4"
  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 6px" }}
>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Interviews Overview</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6f7783" }}
            tickLine={false}
            tickMargin={10}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: "#6f7783" }}
            tickLine={false}
            tickMargin={20}
          />

          <Tooltip
            formatter={(value: number, name: string) => [value, name]}
            labelStyle={{ fontWeight: 600 }}
          />

          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />

          <Line
            type="monotone"
            dataKey="scheduled"
            name="Scheduled"
            stroke="#6366F1" 
            strokeWidth={4}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="#10B981" 
            strokeWidth={4}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="offers"
            name="Offers"
            stroke="#F59E0B" 
            strokeWidth={4}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rejections"
            name="Rejections"
            stroke="#F43F5E" 
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InterviewsChart;
