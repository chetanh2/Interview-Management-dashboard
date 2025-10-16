import { cookies } from "next/headers";
import ClientTabs from "./ClientTabs";


export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const role = (cookies().get("role")?.value ?? "panelist") as "admin" | "panelist" | "ta_member";
  const id = Number(params.id);
  return <ClientTabs id={id} role={role} />;
}
