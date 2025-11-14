import { BellDot, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const navlinks = [
    { title: "Home", href: "/" },
    { title: "Courses", href: "/courses" },
    { title: "About", href: "/about" },
    { title: "Hire from us", href: "/hire-us" },
    { title: "Interviews", href: "/interviews" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4">
      <h1 className="text-2xl font-semibold">HRECT.</h1>

      <ul className="flex items-center gap-20">
        {navlinks.map((item) => {
          return (
            <li key={item.href}>
              <Link href={item.href}>{item.title}</Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-5">
        <button className="w-10 aspect-square rounded-full bg-zinc-50 grid place-items-center">
          <BellDot size={20} className="text-zinc-700" />
        </button>
        <div className="flex items-center gap-5">
          <button className="w-10 aspect-square rounded-full bg-zinc-50 grid place-items-center">
            <UserIcon size={20} className="text-zinc-700" />
          </button>
          <div>
            <p className="text-base font-semibold">John Doe</p>
            <p className="text-sm">Student</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
