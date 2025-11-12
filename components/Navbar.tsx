"use client";
import { Menu, Plus, UploadCloud, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import UploadTwibbon from "./modal/UploadTwibbon";
import CreateLink from "./modal/CreateLink";
import { useUser } from "@/lib/auth/hooks";
import { createClient } from "@/lib/supabase/client";
import SidebarAccountInfo from "./SidebarAccountInfo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUploadTwibbonOpen, setIsUploadTwibbonOpen] = useState(false);
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const { user, loading } = useUser();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSidebarOpen(false);
  };

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
      {/* Login Modal */}
      {isLoginOpen && (
        <Login
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}
      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
      {isUploadTwibbonOpen && (
        <UploadTwibbon onClose={() => setIsUploadTwibbonOpen(false)} />
      )}
      {isCreateLinkOpen && (
        <CreateLink onClose={() => setIsCreateLinkOpen(false)} />
      )}

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
            <a className="font-bold text-xl text-foreground" href="/">
              ViskaDigital<span className="align-super text-xs">©</span>
            </a>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col gap-2 p-4 flex-1">
            {user && !loading && (
              <div className="mb-4">
                <SidebarAccountInfo />
              </div>
            )}

            <button
              onClick={() => {
                setIsSidebarOpen(false);
                setIsCreateLinkOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="size-5" />
              <span className="font-semibold text-sm">Buat Link</span>
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                setIsUploadTwibbonOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UploadCloud className="size-5" />
              <span className="font-semibold text-sm">Upload Twibbon</span>
            </button>

            <div className="auth mt-auto">
              {loading ? (
                <div className="block w-full text-center text-sm font-semibold px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-400">
                  Loading...
                </div>
              ) : user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold px-4 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <LogOut className="size-4" />
                  Keluar
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="block w-full text-center text-sm font-semibold px-4 py-3 rounded-lg border border-primary hover:bg-hover-primary  bg-primary text-white transition-colors"
                >
                  Masuk / Daftar
                </button>
              )}
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
            <a
              href="/"
              className={`font-bold text-xl lg:text-2xl transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              ViskaDigital<span className="align-super text-xs">©</span>
            </a>
          </div>
          <div className="search"></div>
          <div className="cta flex items-center gap-3 ">
            <button
              onClick={() => {
                setIsCreateLinkOpen(true);
              }}
              className={`lg:flex items-center gap-1 hidden duration-200 ease-in-out transition-all hover:text-primary font-semibold text-xs px-4 py-3 rounded-full truncate ${
                isScrolled
                  ? "bg-gray-100 text-foreground"
                  : "bg-white text-foreground"
              }`}
            >
              <Plus className="size-4 font-bold" /> Buat Link
            </button>
            <button
              onClick={() => {
                setIsUploadTwibbonOpen(true);
              }}
              className={`lg:flex items-center gap-1 hidden duration-200 ease-in-out transition-all hover:text-primary font-semibold text-xs px-4 py-3 rounded-full truncate ${
                isScrolled
                  ? "bg-gray-100 text-foreground"
                  : "bg-white text-foreground"
              }`}
            >
              <UploadCloud className="size-4 font-bold" /> Upload Twibbon
            </button>
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
