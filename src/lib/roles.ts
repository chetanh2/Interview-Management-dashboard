export type Role = "admin" | "ta_member" | "panelist";

export const roleHome: Record<Role, string> = {
  admin: "/admin",
  ta_member: "/ta_member",
  panelist: "/panelist",
};
