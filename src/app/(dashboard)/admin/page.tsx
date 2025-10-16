
// import Announcements from "@/components/Announcements";
// import AttendanceChart from "@/components/AttendanceChart";
// import CountChart from "@/components/CountChart";
// import EventCalendar from "@/components/EventCalendar";
// import FinanceChart from "@/components/FinanceChart";
// import KeyPerformanceCard from "@/components/KeyPerformanceCard";

// const AdminPage = () => {

//   return (
//     <div className="">
//     <div className="p-4 flex gap-4 flex-col md:flex-row">
//       {/* LEFT */}
//       <div className="w-full lg:w-2/3 flex flex-col gap-8">
//         {/* USER CARDS */}
//         <div className="flex gap-4 justify-between flex-wrap">
//           <KeyPerformanceCard title="Interviews scheduled this week" value={35} />
//           <KeyPerformanceCard title="Average feedback score" value={7}/>
//           <KeyPerformanceCard title="No-shows" value={17}/>
//         </div>
//         {/* MIDDLE CHARTS */}
//         <div className="flex gap-4 flex-col lg:flex-row">
//           {/* COUNT CHART */}
//           <div className="w-full lg:w-1/3 h-[450px]">
//             <CountChart />
//           </div>
//           {/* ATTENDANCE CHART */}
//           <div className="w-full lg:w-2/3 h-[450px]">
//             <AttendanceChart />
//           </div>
//         </div>
//         {/* BOTTOM CHART */}
//         <div className="w-full h-[500px]">
//           <FinanceChart />
//         </div>
//       </div>
//       {/* RIGHT */}
//       <div className="w-full lg:w-1/3 flex flex-col gap-8">
//         <EventCalendar />
//         <Announcements/>
//       </div>

//     </div>
//     </div>
//   );
// };

// export default AdminPage;

"use client";

import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import KeyPerformanceCard from "@/components/KeyPerformanceCard";

import FiltersProvider, { useFilters } from "../_filters/FiltersProvider";
import FilterBar from "../_filters/FilterBar";

// Example in-memory list; replace with your API data if needed
const INTERVIEWERS = [
  { id: "all", name: "All interviewers" }, // optional: first option handled in component too
  { id: "u1", name: "Sanjay Kulkarni" },
  { id: "u2", name: "Anjali Sharma" },
  { id: "u3", name: "Harshit Rao" },
];

function DashboardBody() {
  const { filters } = useFilters();

  // You can pass `filters` into each component so they query/filter accordingly.
  // For demo, we’ll keep the same numbers—replace with real filtered values.
  return (
    <div className="">
      <FilterBar interviewers={INTERVIEWERS.slice(1)} />

      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* KPI CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">

            <KeyPerformanceCard title="Interviews scheduled this week" value={35} filters={filters} variant="lavender" />
          <KeyPerformanceCard title="No-shows" value={17} filters={filters} variant="purple" />
          <KeyPerformanceCard title="Offers rolled out" value={5} filters={filters} variant="green" />

          </div>

          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart filters={filters} />
            </div>
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart filters={filters} />
            </div>
          </div>

          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            <FinanceChart filters={filters} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar filters={filters} />
          <Announcements filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <FiltersProvider>
      <DashboardBody />
    </FiltersProvider>
  );
}

