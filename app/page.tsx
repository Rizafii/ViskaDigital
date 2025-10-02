import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Trending from "@/components/Popular";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
      <Trending/>
    </>
  );
}
