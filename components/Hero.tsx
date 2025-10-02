"use client";
import { Binoculars, SendHorizonal } from "lucide-react";
import Link from "next/link";
import GridMotion from "@/components/GridMotion";

export default function Hero() {
  const items = [
    "Item 1",
    <div key="jsx-item-1">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 2",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "Item 4",
    <div key="jsx-item-3">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 5",
    <div key="jsx-item-4">Custom JSX Content</div>,
    "Item 7",
    <div key="jsx-item-5">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 8",
    <div key="jsx-item-6">Custom JSX Content</div>,
    "Item 10",
    <div key="jsx-item-7">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 11",
    <div key="jsx-item-8">Custom JSX Content</div>,
    "Item 13",
    <div key="jsx-item-9">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 14",
  ];

  return (
    <header className="w-full  overflow-hidden relative">
      {/* GridMotion as Background */}
      <div className="absolute inset-0 w-full  overflow-hidden">
        <GridMotion items={items} />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none z-10" />

      {/* Content */}
      <div className="w-full relative flex flex-col space-y-4 text-center mx-auto px-4 sm:px-12 lg:px-26 container items-center justify-center pt-42 pb-38">
        <h1 className="font-bold text-5xl leading-14 text-white z-10">
          Buat Twibbon <span className="font-fancy">&</span> Shortlink
          <br />
          Semua dalam Sekejap <span className="font-fancy">: )</span>
        </h1>
        <p className="text-white max-w-[600px] text-lg font-medium z-10">
          Tingkatkan jangkauan kampanye, branding, dan promosi hanya dengan
          sekali klik. Semua serba cepat, praktis, dan terintegrasi.
        </p>
        <div className="cta flex items-center gap-4 z-10">
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-2 hover:bg-white hover:border-white border-white text-sm hover:text-foreground font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200  transition-all"
          >
            Mulai Sekarang
            <SendHorizonal className="size-4" />
          </Link>
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-2 hover:bg-white hover:border-white border-white text-sm hover:text-foreground font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200  transition-all"
          >
            Eksplor Fitur
            <Binoculars className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}