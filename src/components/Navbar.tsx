// // "use client";
// // import Image from "next/image";
// // import { useRouter } from "next/navigation";

// // const Navbar = () => {
// //   const router = useRouter();
// //   const logout = async () => {
// //     await fetch("/api/logout", { method: "POST" });
// //     router.replace("/login");
// //   };
// //   return (
// //     <div className="flex items-center justify-between p-4">
// //       {/* SEARCH BAR */}
// //       <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
// //         <Image src="/search.png" alt="" width={14} height={14} />
// //         <input
// //           type="text"
// //           placeholder="Search..."
// //           className="w-[200px] p-2 bg-transparent outline-none"
// //         />
// //       </div>
// //       {/* ICONS AND USER */}
// //       <div className="flex items-center gap-6 justify-end w-full">
// //         <button
// //           onClick={logout}
// //           className=" rounded bg-black text-white px-4 py-1 text-sm hover:opacity-80"
// //         >
// //           Logout
// //         </button>
// //         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
// //           <Image src="/message.png" alt="" width={20} height={20} />
// //         </div>
// //         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
// //           <Image src="/announcement.png" alt="" width={20} height={20} />
// //           <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
// //             1
// //           </div>
// //         </div>
// //         <div className="flex flex-col">
// //           <span className="text-xs leading-3 font-medium">John Doe</span>
// //           <span className="text-[10px] text-gray-500 text-right">Admin</span>
// //         </div>
// //         <Image
// //           src="/avatar.png"
// //           alt=""
// //           width={36}
// //           height={36}
// //           className="rounded-full"
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Navbar;


// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const router = useRouter();

//   const logout = async () => {
//     await fetch("/api/logout", { method: "POST" });
//     router.replace("/login");
//   };

//   return (
//     <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-300">
//       {/* SEARCH BAR */}
//       <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
//         <Image src="/search.png" alt="" width={14} height={14} />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-[200px] p-2 bg-transparent outline-none"
//         />
//       </div>

//       {/* ICONS AND USER */}
//       <div className="flex items-center gap-6 justify-end w-full">
//         <button
//           onClick={logout}
//           className="rounded bg-black text-white px-4 py-1 text-sm hover:opacity-80"
//         >
//           Logout
//         </button>

//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
//           <Image src="/message.png" alt="" width={20} height={20} />
//         </div>

//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
//           <Image src="/announcement.png" alt="" width={20} height={20} />
//           <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-green-600 text-white rounded-full text-xs">
//             1
//           </div>
//         </div>

//         <div className="flex flex-col">
//           <span className="text-xs leading-3 font-medium">John Doe</span>
//           <span className="text-[10px] text-gray-500 text-right">Admin</span>
//         </div>

//         <Image
//           src="/avatar.png"
//           alt=""
//           width={36}
//           height={36}
//           className="rounded-full"
//         />
//       </div>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserInfo = {
  username?: string;
  role?: string;
};

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>({});

  useEffect(() => {
    // Fetch who is logged in
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-300">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <button
          onClick={logout}
          className="rounded bg-black text-white px-4 py-1 text-sm hover:opacity-80"
        >
          Logout
        </button>

        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>

        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-green-600 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* ✅ Dynamic user info */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">
            {user.username || "—"}
          </span>
          <span className="text-[10px] text-gray-500">
            {user.role?.toUpperCase() || "—"}
          </span>
        </div>

        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
