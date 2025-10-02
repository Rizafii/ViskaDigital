import { Menu, Plus, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
return(
    <nav className="w-full fixed top-0 left-0 ">
        <div className="w-full py-6 mx-auto px-4 sm:px-12 lg:px-26 container flex  justify-between items-center ">
            <div className="brand flex">
                <p className="font-bold text-2xl text-white">ViskaDigital</p>
            </div>
            <div className="search"></div>
            <div className="cta flex items-center gap-3 ">
                <Link href={"#"} className="flex items-center gap-1 hover:border-primary duration-200 ease-in-out transition-all border-3 text-white hover:text-primary border-white border-dashed font-semibold text-xs bg-primary hover:bg-white px-4 py-3 rounded-full truncate">
                <Plus className="size-4 font-bold"/> Buat Link</Link>
                <Link href={"#"} className="flex items-center  gap-1 hover:border-primary duration-200 ease-in-out transition-all border-3 text-white hover:text-primary border-white border-dashed font-semibold text-xs bg-primary hover:bg-white px-4 py-3 rounded-full truncate">
                <UploadCloud className="size-4 font-bold"/> Upload Twibbon</Link>
                {/* <Separator orientation="vertical" className="bg-white self-stretch"/> */}
                <Link href={"#"} className="flex items-center gap-1 font-semibold text-sm bg-white self-stretch aspect-square rounded-full px-4.5">
                <Menu className="size-4 font-bold text-primary"/></Link>
            </div>
        </div>
    </nav>
)
}