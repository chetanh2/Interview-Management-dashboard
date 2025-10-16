// import { role } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";
// import { RequirePerm } from "./access/Guards";

// // const menuItems = [
// //   {
// //     title: "MENU",
// //     items: [
// //       {
// //         icon: "/home.png",
// //         label: "Home",
// //         href: "/",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //       {
// //         icon: "/student.png",
// //         label: "People",
// //         href: "/list/peoples",
// //         visible: ["admin", "teacher"],
// //       },
// //       {
// //         icon: "/teacher.png",
// //         label: "Candidates",
// //         href: "/candidates",
// //         visible: ["admin", "ta_member", "panelist"],
// //       },

// //       {
// //         icon: "/attendance.png",
// //         label: "Attendance",
// //         href: "/list/attendance",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //       {
// //         icon: "/message.png",
// //         label: "Messages",
// //         href: "/list/messages",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //       {
// //         icon: "/announcement.png",
// //         label: "Announcements",
// //         href: "/list/announcements",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //     ],
// //   },
// //   {
// //     title: "OTHER",
// //     items: [
// //       {
// //         icon: "/profile.png",
// //         label: "Profile",
// //         href: "/profile",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //       {
// //         icon: "/setting.png",
// //         label: "Settings",
// //         href: "/settings",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //       {
// //         icon: "/logout.png",
// //         label: "Logout",
// //         href: "/logout",
// //         visible: ["admin", "teacher", "student", "parent"],
// //       },
// //     ],
// //   },
// // ];
// const menuItems = [
//   {
//     title: "MENU",
//     items: [
//       {
//         icon: "/home.png",
//         label: "Home",
//         href: "/",
//         visible: ["admin", "ta_member", "panelist"], // ✅ dashboard entry for all roles
//       },
//       {
//         icon: "/student.png",
//         label: "People",
//         href: "/list/peoples",
//         visible: ["admin", "ta_member"], // ✅ admin + TA member can manage/view people
//       },
//       {
//         icon: "/teacher.png",
//         label: "Candidates",
//         href: "/candidates",
//         visible: ["admin", "ta_member", "panelist"], // ✅ all 3 roles can view candidates
//       },
//       <RequirePerm perm="roles:manage">
//       <Link href="/admin/roles" className="flex items-center gap-2">
//         <img src="/settings.png" alt="" />
//         <span>Role Management</span>
//       </Link>
//     </RequirePerm>,

//       {
//         icon: "/attendance.png",
//         label: "Attendance",
//         href: "/list/attendance",
//         visible: ["admin", "ta_member"], // ✅ only admin or TA manage attendance
//       },
//       {
//         icon: "/message.png",
//         label: "Messages",
//         href: "/list/messages",
//         visible: ["admin", "ta_member", "panelist"], // ✅ optional: all roles if messaging is universal
//       },
//       {
//         icon: "/announcement.png",
//         label: "Announcements",
//         href: "/list/announcements",
//         visible: ["admin", "ta_member", "panelist"], // ✅ all roles can read announcements
//       },
//     ],
//   },
//   {
//     title: "OTHER",
//     items: [
//       {
//         icon: "/profile.png",
//         label: "Profile",
//         href: "/profile",
//         visible: ["admin", "ta_member", "panelist"], // ✅ profile relevant to all
//       },
//       {
//         icon: "/setting.png",
//         label: "Settings",
//         href: "/settings",
//         visible: ["admin"], // ✅ usually only admin manages settings
//       },
//       {
//         icon: "/logout.png",
//         label: "Logout",
//         href: "/logout",
//         visible: ["admin", "ta_member", "panelist"], // ✅ everyone should see logout
//       },
//     ],
//   },
// ];

// const Menu = () => {
//   return (
//     <div className="mt-4 text-sm">
//       {menuItems.map((i) => (
//         <div className="flex flex-col gap-2" key={i.title}>
//           <span className="hidden lg:block text-gray-400 font-light my-4">
//             {i.title}
//           </span>
//           {i.items.map((item) => {
//             if (item.visible.includes(role)) {
//               return (
//                 <Link
//                   href={item.href}
//                   key={item.label}
//                   className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
//                 >
//                   <Image src={item.icon} alt="" width={20} height={20} />
//                   <span className="hidden lg:block">{item.label}</span>
//                 </Link>
//               );
//             }
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Menu;


"use client";

import Image from "next/image";
import Link from "next/link";
import { role } from "@/lib/data";          // if you already read role into here
import { RequirePerm } from "./access/Guards";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "ta_member", "panelist"],
      },
      {
        icon: "/student.png",
        label: "People",
        href: "/list/peoples",
        visible: ["admin", "ta_member"],
      },
      {
        icon: "/teacher.png",
        label: "Candidates",
        href: "/candidates",
        visible: ["admin", "ta_member", "panelist"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "ta_member"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "ta_member", "panelist"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "ta_member", "panelist"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "ta_member", "panelist"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin"], // admin-only settings
      },
      //   {
      //   icon: "/setting.png",
      //   label: "Role Management",
      //   href: "/admin/roles",
      //   visible: ["admin"], // admin-only
      // },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "ta_member", "panelist"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {section.items.map((item) => {
            if (!item.visible.includes(role)) return null;
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}

          {/* Role Management (admin-only) rendered via permission guard */}
          {section.title === "OTHER" && (
            <RequirePerm perm="roles:manage">
              <Link
                href="/admin/roles"
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src="/setting.png" alt="" width={20} height={20} />
                <span className="hidden lg:block">Role Management</span>
              </Link>
            </RequirePerm>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
