import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Trending from "@/components/Popular";
import TopCreator from "@/components/TopCreator";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trending />
      <TopCreator />
      <Footer />
    </>
  );
}
