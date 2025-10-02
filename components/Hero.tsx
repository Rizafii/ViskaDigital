import { Binoculars, SendHorizonal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="w-full bg-primary overflow-hidden">
      <div className="w-full flex flex-col space-y-4 text-center mx-auto px-4 sm:px-12 lg:px-26 container items-center justify-center pt-40 pb-20">
        <h1 className="font-bold text-5xl leading-14 text-white">
          Buat Twibbon <span className="font-fancy">&</span> Shortlink
          <br />
          Semua dalam Sekejap <span className="font-fancy">: )</span>
        </h1>
        <p className="text-white max-w-[600px] text-lg font-medium">
          Tingkatkan jangkauan kampanye, branding, dan promosi hanya dengan
          sekali klik. Semua serba cepat, praktis, dan terintegrasi.
        </p>
        <div className="cta flex items-center gap-4">
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-dashed border-3 hover:bg-white hover:border-primary border-white  text-sm hover:text-primary font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200 ease-in-out transition-all"
          >
            Mulai Sekarang<SendHorizonal className="size-4" />
          </Link>
          <Link
            href={"#"}
            className="flex gap-2 items-center truncate bg-transparent text-white border-dashed border-3 hover:bg-white hover:border-primary border-white  text-sm hover:text-primary font-semibold px-5 py-3 rounded-full hover:bg-secondary duration-200 ease-in-out transition-all"
          >
            Eksplor Fitur<Binoculars className="size-4" />
          </Link>

        </div>
      </div>
    </header>
  );
}
