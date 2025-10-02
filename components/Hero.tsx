"use client";
import GridMotion from "@/components/GridMotion";
import { Binoculars, SendHorizonal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const items = [
    "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    "https://i.pinimg.com/736x/33/db/ce/33dbce93c908c1caca4e70f7961c994c.jpg",
    "https://i.pinimg.com/736x/78/48/4d/78484d84e224c969518f9c0cd07349ac.jpg",
    "https://i.pinimg.com/736x/91/6e/28/916e28128145f2feba3ace91ac8885a6.jpg",
    "https://i.pinimg.com/736x/eb/ea/d9/ebead91da23289521dc6d27e26ea2e25.jpg",
    "https://i.pinimg.com/736x/b2/87/3b/b2873ba2868e69c5836901cd826c6155.jpg",
    "https://i.pinimg.com/736x/53/1b/22/531b22ab2cffaf03c7faecef2fdddfb7.jpg",
    "https://i.pinimg.com/736x/ca/ec/94/caec94b6dd13f3c1269453cc12749462.jpg",
    "https://i.pinimg.com/736x/e9/64/3f/e9643ff42b8b0953c7d17443704c719c.jpg",
    "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    "https://i.pinimg.com/736x/33/db/ce/33dbce93c908c1caca4e70f7961c994c.jpg",
    "https://i.pinimg.com/736x/78/48/4d/78484d84e224c969518f9c0cd07349ac.jpg",
    "https://i.pinimg.com/736x/91/6e/28/916e28128145f2feba3ace91ac8885a6.jpg",
    "https://i.pinimg.com/736x/eb/ea/d9/ebead91da23289521dc6d27e26ea2e25.jpg",
    "https://i.pinimg.com/736x/b2/87/3b/b2873ba2868e69c5836901cd826c6155.jpg",
    "https://i.pinimg.com/736x/53/1b/22/531b22ab2cffaf03c7faecef2fdddfb7.jpg",
    "https://i.pinimg.com/736x/ca/ec/94/caec94b6dd13f3c1269453cc12749462.jpg",
    "https://i.pinimg.com/736x/e9/64/3f/e9643ff42b8b0953c7d17443704c719c.jpg",
    "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    "https://i.pinimg.com/736x/33/db/ce/33dbce93c908c1caca4e70f7961c994c.jpg",
    "https://i.pinimg.com/736x/78/48/4d/78484d84e224c969518f9c0cd07349ac.jpg",
    "https://i.pinimg.com/736x/91/6e/28/916e28128145f2feba3ace91ac8885a6.jpg",
    "https://i.pinimg.com/736x/eb/ea/d9/ebead91da23289521dc6d27e26ea2e25.jpg",
    "https://i.pinimg.com/736x/b2/87/3b/b2873ba2868e69c5836901cd826c6155.jpg",
    "https://i.pinimg.com/736x/53/1b/22/531b22ab2cffaf03c7faecef2fdddfb7.jpg",
    "https://i.pinimg.com/736x/ca/ec/94/caec94b6dd13f3c1269453cc12749462.jpg",
    "https://i.pinimg.com/736x/e9/64/3f/e9643ff42b8b0953c7d17443704c719c.jpg",
    "https://i.pinimg.com/736x/e9/64/3f/e9643ff42b8b0953c7d17443704c719c.jpg",
  ];

  return (
    <header className="w-full  overflow-hidden relative">
      {/* GridMotion as Background */}
      <div className="absolute inset-0 w-full  overflow-hidden">
        <GridMotion items={items} />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none z-10" />

      {/* Content */}
      <div className="w-full relative flex flex-col space-y-4 text-center mx-auto px-4 sm:px-12 lg:px-26 container items-start lg:items-center justify-center pt-42 pb-46">
        <h1 className="font-bold text-start lg:text-center text-4xl lg:text-5xl leading-12 lg:leading-14 text-white z-10">
          Buat Twibbon <span className="font-fancy">&</span> Shortlink
          <br className="hidden lg:flex" />
          {" "}Semua dalam Sekejap <span className="font-fancy">: )</span>
        </h1>
        <p className="text-white max-w-[600px] text-base text-start lg:text-center lg:text-lg font-medium z-10">
          Tingkatkan jangkauan kampanye, branding, dan promosi hanya dengan
          sekali klik. Semua serba cepat, praktis, dan terintegrasi.
        </p>
        <div className="cta flex items-center gap-4 z-10">
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-2 hover:bg-white hover:border-white border-white text-xs lg:text-sm hover:text-foreground font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200  transition-all"
          >
            Mulai Sekarang
            <SendHorizonal className="size-4" />
          </Link>
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-2 hover:bg-white hover:border-white border-white text-xs lg:text-sm hover:text-foreground font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200  transition-all"
          >
            Eksplor Fitur
            <Binoculars className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
