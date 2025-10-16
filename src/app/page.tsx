// app/page.tsx (server component)
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const roleHome: Record<string, string> = {
  admin: "/admin",
  ta_member: "/ta_member",
  panelist: "/panelist",
};

export default function Home() {
  const store = cookies();
  const token = store.get("dj_token")?.value;
  const role = store.get("role")?.value as keyof typeof roleHome | undefined;

  if (token && role && roleHome[role]) {
    redirect(roleHome[role]);
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      <Link href="/" className="">
        <Image src="/elyx_digital_logo-full.jpg" alt="logo" width={100} height={200} />
      </Link>

      <div className="flex gap-4 items-center justify-between min-h-[60vh]">
        <div className="info">
          <h1 className="font-bold mb-1 text-[80px] uppercase">
            job <span className="text-[#64A172]">tracking</span> app
          </h1>
          <p className="max-w-2xl mb-12 text-[#64748b]">
          I&apos;m baby wayfarers hoodie next level taiyaki brooklyn cliche blue
          bottle single-origin coffee chia. Aesthetic post-ironic venmo, quinoa
          lo-fi tote bag adaptogen everyday carry meggings +1 brunch narwhal.
        </p>
          <Link href="/register" className="cursor-pointer p-4 mr-4 bg-[#64A172] text-white rounded hover:bg-[#538e5a]">
            Register
          </Link>
          <Link href="/login" className="cursor-pointer p-4 mr-4 bg-[#64A172] text-white rounded hover:bg-[#538e5a]">
            Login / Demo User
          </Link>
        </div>

        <Image src="/main.svg" alt="job hunt" width={100} height={100} className="w-[30%]" />
      </div>
    </div>
  );
}
