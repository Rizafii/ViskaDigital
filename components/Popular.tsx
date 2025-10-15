import { ArrowRightCircle, Eye, UsersRound } from "lucide-react";
import Link from "next/link";

export default function Popular() {
  const twibbon = [
    {
      title: "Coding Challenge 2024",
      author: "Dicoding",
      supporter: "7.5K",
      url: "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    },
    {
      title: "Dukung Timnas Indonesia",
      author: "PSSI",
      supporter: "5K",
      url: "https://i.pinimg.com/736x/33/db/ce/33dbce93c908c1caca4e70f7961c994c.jpg",
    },
    {
      title: "Hari Lingkungan Hidup",
      author: "UNEP",
      supporter: "4.8K",
      url: "https://i.pinimg.com/736x/78/48/4d/78484d84e224c969518f9c0cd07349ac.jpg",
    },
    {
      title: "Ayo Donor Darah!",
      author: "PMI",
      supporter: "3K",
      url: "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    },
    {
      title: "Dukung Pendidikan Anak",
      author: "UNICEF",
      supporter: "2K",
      url: "https://i.pinimg.com/736x/b2/87/3b/b2873ba2868e69c5836901cd826c6155.jpg",
    },
  ];
  return (
    <section className="w-full  overflow-hidden relative rounded-4xl lg:rounded-t-[52px] -mt-12 z-10">
      <div className="w-full py-8 lg:py-16 mx-auto px-6 sm:px-12 lg:px-26 container bg-white rounded-2xl flex flex-col items-start justify-center">
        <div className="header flex w-full lg:flex-row flex-col lg:justify-between items-start gap-4  lg:items-center">
          <div className="left">
            <h1 className="font-bold text-xl lg:text-2xl">Sedang Naik Daun</h1>
            <p className="font-medium text-base lg:text-lg">
              Lihat twibbon yang sedang populer dan banyak digunakan saat ini.
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
        <div className="twibbon-overview w-full">
          <div className="flex snap-x snap-mandatory lg:grid lg:grid-cols-5 gap-6 mt-4 overflow-x-auto lg:overflow-x-visible flex-nowrap pb-4 scrollbar-hide">
            {twibbon.map((item, index) => (
              <Link
                href={item.url}
                key={index}
                className="twibbon-item snap-always flex-shrink-0 lg:flex-shrink"
              >
                <div className="sampul relative bg-white rounded-lg shadow-md group flex items-center justify-center h-60 w-60">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-auto h-full object-cover rounded-lg shadow-md scale-95 group-hover:scale-100 duration-200 transition-all "
                  />
                  <div className="absolute inset-0 group-hover:bg-black/20 rounded-lg scale-95 group-hover:scale-100 duration-200 transition-all " />
                  <span className="absolute items-center justify-center flex opacity-0 group-hover:opacity-100 duration-200 transition-all  text-white bg-primary font-semibold text-sm rounded-full px-4 py-2 ">
                    Lihat
                  </span>
                </div>

                <div className="information flex flex-col mt-2 gap-1 w-64">
                  <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                  <p className="text-sm text-gray-500 font-semibold ">
                    {item.author}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <UsersRound className="size-4 mr-1" />
                    {item.supporter} supporters
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="#"
          className="flex lg:hidden w-full text-sm py-3 items-center justify-center border border-primary text-primary rounded-md mt-8 font-medium gap-2 hover:bg-primary hover:text-white duration-200 transition-all"
        >
          <Eye className="size-4" />
          Lihat Semua
        </Link>
      </div>
    </section>
  );
}
