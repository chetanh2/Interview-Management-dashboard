

"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";

type Props = { filters?: Filters };

// Sample data for interview dashboard
const baseData = [
  { name: "Frontend Dev", applied: 120, interviewed: 80, selected: 20 },
  { name: "Backend Dev", applied: 100, interviewed: 60, selected: 15 },
  { name: "QA Engineer", applied: 90, interviewed: 50, selected: 10 },
  { name: "UI/UX Designer", applied: 70, interviewed: 40, selected: 12 },
  { name: "DevOps", applied: 60, interviewed: 35, selected: 8 },
];

export default function InterviewChart({ filters }: Props) {
  // Optionally adjust counts based on filters
  const data = baseData.map((d) => {
    let applied = d.applied;
    let interviewed = d.interviewed;
    let selected = d.selected;

    if (filters?.role && filters.role !== "all") applied -= 10;
    if (filters?.interviewer && filters.interviewer !== "all") interviewed -= 5;

    // keep non-negative
    applied = Math.max(applied, 0);
    interviewed = Math.max(interviewed, 0);
    selected = Math.max(selected, 0);

    return { ...d, applied, interviewed, selected };
  });

  return (
    <div
  className="bg-white rounded-xl w-full h-full p-4"
  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 6px" }}
>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Interview Dashboard</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#1e201e4d" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#1e201e4d" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          {/* Updated colors */}
          <Bar
            dataKey="applied"
            fill="#787af1"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />{" "}
          {/* Indigo */}
          <Bar
            dataKey="interviewed"
            fill="#f2b13f"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />{" "}
          {/* Amber */}
          <Bar
            dataKey="selected"
            fill="#44d8a7"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />{" "}
          {/* Emerald */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
