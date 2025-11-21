"use client";
import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import Topbar from "./Components/Topbar";
import Sidebar from "./Components/Sidebar";
import Footer from "./Components/Footer";
import Background from "./Components/Particles";
import AnimatedLayout from "./Components/AnimatedLayout";
import { useMainData } from "./context/MainDataContext";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

export default function ClientLayout({ children }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCloseLogin, setIsCloseLogin] = useState(false);
  const [isCloseAdmin, setIsCloseAdmin] = useState(false);
  const [isCloseAuthenticate, setIsCloseAuthenticate] = useState(false);

  const { load } = useMainData();
  const { user, getUserData, setUser } = useAuth();
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const role = isAdminRoute ? "admin" : "user";

  const activePage = useMemo(() => {
    const cleanPath = pathname.replace(/^\/|\/$/g, "");
    const parts = cleanPath.split("/");
    const isAdmin = parts[0] === "admin";

    if (isAdmin) {
      if (parts.length === 1) return "AdminMain";
      const subPage = parts[1];
      const map = { home: "Home", skills: "Skills", projects: "Projects" };
      return map[subPage] ? `Admin${map[subPage]}` : "AdminMain";
    } else {
      const map = {
        "": "Home",
        home: "Home",
        skills: "Skills",
        projects: "Projects",
      };
      return map[parts[0]] || "Home";
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showLoginBar = pathname === "/" && !user?.user?.role && !isCloseLogin;

  const sendAuthLink = async () => {
    try {
      await axios.get("/api/auth/send-auth-link", {
        withCredentials: true,
      });
      toast.success("Link Send To Your Mail");
    } catch (err) {
      console.error("Send auth link error:", err);
      toast.error("Failed to Send Link");
    }
  };
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    toast.success("Logged out successfully");
  };

  if (!load) return <AnimatedLayout visible={!load} />;

  return (
    <>
      <Background />

      {showLoginBar && (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-[#326ae4] text-white font-bold z-[2] sticky top-0 left-0 gap-2 sm:gap-0">
          <span className="text-center sm:text-left">
            Do you want to Login / Register?
          </span>

          <span className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white bg-green-600 px-3 py-1 rounded"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-white bg-green-600 px-3 py-1 rounded"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={() => setIsCloseLogin(true)}
              className="w-[30px] bg-transparent text-white text-2xl font-bold border-none cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </span>
        </div>
      )}

      {user?.user?.role === "admin" &&
        !user?.user?.authenticated &&
        !isCloseAuthenticate &&
        pathname === "/" && (
          <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-[#326ae4] text-white font-semibold z-[2] sticky top-0 left-0 gap-2 sm:gap-0">
            <span className="text-center sm:text-left">Verify Your Email</span>

            <span className="flex items-center gap-3">
              <button
                onClick={sendAuthLink}
                className="text-white cursor-pointer bg-green-600 px-3 py-1 rounded"
              >
                Send Link
              </button>
              <button
                type="button"
                onClick={() => setIsCloseAuthenticate(true)}
                className="w-[30px] bg-transparent text-white text-2xl font-bold border-none cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </span>
          </div>
        )}

      {user?.user?.role === "admin" &&
        user?.user?.authenticated &&
        !isCloseAdmin &&
        pathname === "/" && (
          <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-[#326ae4] text-white font-semibold z-[2] sticky top-0 left-0 gap-2 sm:gap-0">
            <span className="text-center sm:text-left">
              Hey Admin! Want to go to the Admin Page?
            </span>

            <span className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-white bg-green-600 px-3 py-1 rounded"
              >
                Admin Page
              </Link>
              <button
                type="button"
                onClick={() => setIsCloseAdmin(true)}
                className="w-[30px] bg-transparent text-white text-2xl font-bold border-none cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </span>
          </div>
        )}

      <Topbar role={role} activePage={activePage} setOpenMenu={setOpenMenu} />

      <Sidebar
        role={role}
        activePage={activePage}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />

      <main>{children}</main>
      <Footer />
      {user?.user?.role && pathname === "/" && (
        <div className="w-full flex justify-end px-[0.7cm] py-[0.3cm] bg-[#326ae4] text-white font-semibold z-[50000] sticky top-0 left-0">
          <button
            onClick={handleLogout}
            className=" cursor-pointer text-white bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
