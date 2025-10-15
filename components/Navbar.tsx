"use client";
import { Menu, Plus, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[450px] shadow-2xl bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6">
            <p className="font-bold text-xl text-foreground">
              ViskaDigital<span className="align-super text-xs">©</span>
            </p>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col gap-2 p-4 flex-1">
            <Link
              href={"#"}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="size-5" />
              <span className="font-semibold text-sm">Buat Link</span>
            </Link>
            <Link
              href={"#"}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UploadCloud className="size-5" />
              <span className="font-semibold text-sm">Upload Twibbon</span>
            </Link>

            <div className="auth mt-auto">
              <Link
                href={"#"}
                onClick={() => setIsSidebarOpen(false)}
                className="block w-full text-center text-sm font-semibold px-4 py-3 rounded-lg border border-primary hover:bg-hover-primary  bg-primary text-white transition-colors"
              >
                Masuk / Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 z-40">
        <div
          className={`w-full py-6 mx-auto px-6 sm:px-12 lg:px-26 container flex justify-between items-center transition-all duration-300 ${
            isScrolled
              ? "bg-white shadow"
              : "bg-gradient-to-b from-black to-transparent"
          }`}
        >
          <div className="brand flex">
            <p
              className={`font-bold text-xl lg:text-2xl transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              ViskaDigital<span className="align-super text-xs">©</span>
            </p>
          </div>
          <div className="search"></div>
          <div className="cta flex items-center gap-3 ">
            <Link
              href={"#"}
              className={`lg:flex items-center gap-1 hidden duration-200 ease-in-out transition-all hover:text-primary font-semibold text-xs px-4 py-3 rounded-full truncate ${
                isScrolled
                  ? "bg-gray-100 text-foreground"
                  : "bg-white text-foreground"
              }`}
            >
              <Plus className="size-4 font-bold" /> Buat Link
            </Link>
            <Link
              href={"#"}
              className={`lg:flex items-center gap-1 hidden duration-200 ease-in-out transition-all hover:text-primary font-semibold text-xs px-4 py-3 rounded-full truncate ${
                isScrolled
                  ? "bg-gray-100 text-foreground"
                  : "bg-white text-foreground"
              }`}
            >
              <UploadCloud className="size-4 font-bold" /> Upload Twibbon
            </Link>
            {/* <Separator orientation="vertical" className="bg-white self-stretch"/> */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`flex items-center gap-1 font-semibold text-sm self-stretch aspect-square rounded-full px-3 transition-colors duration-300 ${
                isScrolled
                  ? "bg-gray-100 text-foreground"
                  : "bg-white text-foreground"
              }`}
            >
              <Menu className="size-4 font-bold " />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
