"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Topbar from "./Components/Topbar";
import Sidebar from "./Components/Sidebar";
import Footer from './Components/Footer'

export default function ClientLayout({ children }) {
  const [openMenu, setOpenMenu] = useState(false);

  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const role = isAdmin ? "admin" : "user";

  let activePage = "Home"; // default
  if (pathname.includes("skills")) activePage = "Skills";
  else if (pathname.includes("projects")) activePage = "Projects";
  else if (pathname === "/admin") activePage = "AdminMain";
  else if (pathname === "/admin/home") activePage = "Home";
  else if (pathname === "/admin/skills") activePage = "Skills";
  else if (pathname === "/admin/projects") activePage = "Projects";

  return (
    <>
      <Topbar role={role} activePage={activePage} setOpenMenu={setOpenMenu} />
      <Sidebar role={role} activePage={activePage} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
      <main>{children}</main>
      <Footer/>
    </>
  );
}
