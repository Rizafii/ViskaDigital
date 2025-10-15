"use client";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function TopCreator() {
  const [currentPage, setCurrentPage] = useState(0);

  const creators = [
    {
      id: 1,
      name: "MPK Viska",
      avatar: "/logo/mpk.svg",
      followers: "10K",
      url: "https://example.com/johndoe",
    },
    {
      id: 2,
      name: "SMKN 6 Surakarta",
      avatar: "/logo/smk.svg",
      followers: "8K",
      url: "https://example.com/janesmith",
    },
    {
      id: 3,
      name: "OSIS Viska",
      avatar: "/logo/osis.svg",
      followers: "6K",
      url: "https://example.com/alicejohnson",
    },
    {
      id: 4,
      name: "BEM Viska",
      avatar: "/logo/mpk.svg",
      followers: "5K",
      url: "https://example.com/creator4",
    },
    {
      id: 5,
      name: "Himpunan Mahasiswa",
      avatar: "/logo/smk.svg",
      followers: "4.5K",
      url: "https://example.com/creator5",
    },
    {
      id: 6,
      name: "UKM Fotografi",
      avatar: "/logo/osis.svg",
      followers: "4K",
      url: "https://example.com/creator6",
    },
    {
      id: 7,
      name: "Komunitas Desain",
      avatar: "/logo/mpk.svg",
      followers: "3.5K",
      url: "https://example.com/creator7",
    },
    {
      id: 8,
      name: "Tim Kreatif",
      avatar: "/logo/smk.svg",
      followers: "3K",
      url: "https://example.com/creator8",
    },
    {
      id: 9,
      name: "Media Center",
      avatar: "/logo/osis.svg",
      followers: "2.5K",
      url: "https://example.com/creator9",
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(creators.length / itemsPerPage);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / totalPages;
    const page = Math.round(scrollLeft / itemWidth);
    setCurrentPage(page);
  };

  return (
    <main className="w-full overflow-hidden relative">
      <div className="container w-full py-8 lg:py-16 mx-auto px-6 sm:px-12 lg:px-26 bg-white rounded-2xl flex flex-col items-start justify-center">
        <div className="header flex w-full lg:flex-row flex-col lg:justify-between items-start gap-4 lg:items-center">
          <div className="left">
            <h1 className="font-bold text-xl lg:text-2xl">Kreator Teratas</h1>
            <p className="font-medium text-base lg:text-lg">
              Temukan kreator twibbon teratas.
            </p>
          </div>
          <div className="right">
            <Link
              href={"#"}
              className="px-4 hidden py-2 text-xs font-medium truncate rounded-full lg:flex items-center gap-2 hover:bg-primary hover:text-white duration-200 transition-all text-primary border border-primary"
            >
              Lihat Semua
              <ArrowRightCircle className="size-4 fill-primary text-white" />
            </Link>
          </div>
        </div>

        <div className="creators-overview w-full">
          {/* Mobile View - Swipeable */}
          <div className="lg:hidden">
            <div
              className="flex snap-x snap-mandatory gap-8  overflow-x-auto flex-nowrap pb-4 scrollbar-hide"
              onScroll={handleScroll}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="snap-start flex-shrink-0 w-full flex flex-col gap-4"
                >
                  {creators
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage
                    )
                    .map((item) => (
                      <Link
                        href={item.url}
                        key={item.id}
                        className="creator-item flex items-center gap-4 py-6 border-b border-b-foreground/40"
                      >
                        <p className="font-bold text-3xl opacity-30">
                          #{item.id}
                        </p>
                        <Image
                          height={100}
                          width={100}
                          src={item.avatar}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                        <div className="info flex flex-col">
                          <h2 className="font-bold text-lg">{item.name}</h2>
                          <p className="text-sm text-gray-500 font-semibold">
                            {item.followers} Pengikut
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = document.querySelector(".snap-x");
                    if (container) {
                      container.scrollTo({
                        left: index * container.clientWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentPage === index ? "bg-primary w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop View - Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 space-x-10 ">
            {creators.map((item) => (
              <Link
                href={item.url}
                key={item.id}
                className="creator-item hover:-translate-y-2 duration-200 flex items-center gap-4 py-8 border-b border-b-foreground/10"
              >
                <p className="font-bold text-3xl opacity-30">#{item.id}</p>
                <Image
                  height={100}
                  width={100}
                  src={item.avatar}
                  alt={item.name}
                  className="w-18 h-18 object-cover rounded-full"
                />
                <div className="info flex flex-col">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-500 font-semibold">
                    {item.followers} Pengikut
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
