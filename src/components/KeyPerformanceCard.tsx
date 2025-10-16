// // "use client";
// // import { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";
// // import Image from "next/image";

// // interface KeyPerformanceCardProps {
// //   title: string;
// //   value: number;
// //   filters?: Filters; // ✅ add this line
// // }

// // const KeyPerformanceCard: React.FC<KeyPerformanceCardProps> = ({ title, value, filters }) => {
// //   return (
// //     <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
// //       <div className="flex justify-between items-center">
// //         <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
// //           2024/25
// //         </span>
// //         <Image src="/more.png" alt="" width={20} height={20} />
// //       </div>
// //       <h1 className="text-2xl font-semibold my-4">{value}</h1>
// //       <h2 className="capitalize text-sm font-medium text-gray-500">{title}</h2>
// //     </div>
// //   );
// // };

// // export default KeyPerformanceCard;


// "use client";
// import { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";
// import Image from "next/image";

// interface KeyPerformanceCardProps {
//   title: string;
//   value: number;
//   filters?: Filters;
// }

// const KeyPerformanceCard: React.FC<KeyPerformanceCardProps> = ({
//   title,
//   value,
//   filters,
// }) => {
//   // 🧠 Example: Adjust the KPI based on filters
//   let filteredValue = value;

//   if (filters?.role && filters.role !== "all") {
//     filteredValue -= 2; // e.g., fewer interviews for a specific role
//   }
//   if (filters?.interviewer && filters.interviewer !== "all") {
//     filteredValue -= 1; // e.g., specific interviewer conducted fewer sessions
//   }
//   if (filters?.from && filters?.to) {
//     filteredValue -= 3; // e.g., date range narrower → fewer events
//   }

//   // Ensure it never goes below 0
//   if (filteredValue < 0) filteredValue = 0;

//   return (
//     <div className="rounded-2xl bg-brand-lavender hover:shadow-lg transition  p-4 flex-1 min-w-[130px]">
//       <div className="flex justify-between items-center">
//         <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
//           2024/25
//         </span>
//         <Image src="/more.png" alt="" width={20} height={20} />
//       </div>
//       <h1 className="text-2xl font-semibold my-4">{filteredValue}</h1>
//       <h2 className="capitalize text-sm font-medium text-gray-500">{title}</h2>
//     </div>
//   );
// };

// export default KeyPerformanceCard;


"use client";
import { Filters } from "@/app/(dashboard)/_filters/FiltersProvider";
import Image from "next/image";

type Variant = "lavender" | "yellow" | "purple" | "green";

interface KeyPerformanceCardProps {
  title: string;
  value: number;
  filters?: Filters;
  /** choose the background/text combo */
  variant?: Variant;
  /** optional extra classes from parent */
  className?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  lavender: "bg-brand-lavender text-brand-gray",
  yellow:   "bg-brand-yellow text-brand-gray",
  purple:   "bg-brand-purple text-white",
  green:    "bg-brand-green text-white",
};

export default function KeyPerformanceCard({
  title,
  value,
  filters,
  variant = "lavender",
  className = "",
}: KeyPerformanceCardProps) {
  // simple demo adjustment using filters
  let filteredValue = value;
  if (filters?.role && filters.role !== "all") filteredValue -= 2;
  if (filters?.interviewer && filters.interviewer !== "all") filteredValue -= 3;
  if (filters?.from && filters?.to) filteredValue -= 5;
  if (filteredValue < 0) filteredValue = 2;

  const cardClass =
    `rounded-2xl shadow-xl drop-shadow-md transition p-4 flex-1 min-w-[130px] ${VARIANT_CLASSES[variant]} ${className}`;

  return (
    <div className={cardClass} >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{filteredValue}</h1>
      <h2 className="capitalize text-sm font-medium opacity-80">{title}</h2>
    </div>
  );
}
