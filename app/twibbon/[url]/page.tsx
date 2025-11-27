"use client";

import { useEffect, useState } from "react";
import { getTwibbonByUrl } from "@/lib/supabase/twibbon";
import { Spinner } from "@/components/ui/spinner";
import TwibbonDetail from "@/components/twibbon/TwibbonDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

export default function TwibbonPage() {
  const params = useParams();
  const url = params.url as string;

  const [twibbon, setTwibbon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTwibbon = async () => {
      if (!url) return;

      setLoading(true);
      const result = await getTwibbonByUrl(url);

      if (result.success && result.data) {
        setTwibbon(result.data);
      } else {
        setError(result.error || "Twibbon tidak ditemukan");
      }

      setLoading(false);
    };

    fetchTwibbon();
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        <Spinner />
      </div>
    );
  }

  if (error || !twibbon) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white p-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Twibbon Tidak Ditemukan</h1>
            <p className="text-xl text-white/80">{error}</p>
            <a
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold rounded-full transition-colors"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <TwibbonDetail twibbon={twibbon} />
      <Footer />
    </>
  );
}
