"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Copy, MoreVertical, Maximize2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TwibbonDetailProps {
  twibbon: {
    uid: number;
    name: string;
    description: string;
    path: string;
    url: string;
    publicUrl: string;
    created_at: string;
    supporterCount: number;
    users: {
      uid: string;
      name: string;
      email: string;
      created_at: string;
      creator_data: Array<{
        bio: string | null;
        photo_profile_path: string | null;
      }>;
    };
  };
}

export default function TwibbonDetail({ twibbon }: TwibbonDetailProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const creatorData = twibbon.users.creator_data?.[0];
  const creatorPhotoUrl = creatorData?.photo_profile_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/${creatorData.photo_profile_path}`
    : undefined;

  const twibbonUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/${twibbon.url}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(twibbonUrl);
    toast.success("URL berhasil disalin!");
  };

  const handleChoosePhoto = () => {
    // Logic for choosing photo will be implemented later
    toast.info("Fitur ini akan segera tersedia");
  };

  const createdDate = new Date(twibbon.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="container mx-auto px-4 py-8 pt-35">
        <div className="flex items-center gap-8 max-w-7xl mx-auto">
          {/* Left Side - Twibbon Preview */}
          <div className="flex flex-col ">
            <Card className="bg-white/95 backdrop-blur-sm p-0 shadow-2xl">
              <div className="relative aspect-square w-[400px] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={twibbon.publicUrl}
                  alt={twibbon.name}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Maximize2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </Card>

            <Button
              onClick={handleChoosePhoto}
              size="lg"
              className="mt-6 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold rounded-full shadow-lg text-lg py-6"
            >
              Choose Your Photo
            </Button>
          </div>

          {/* Right Side - Campaign Info */}
          <div className="flex flex-col text-white">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">{twibbon.name}</h1>

              {/* Creator Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={creatorPhotoUrl} alt={twibbon.users.name} />
                  <AvatarFallback className="bg-cyan-400 text-gray-900">
                    {twibbon.users.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{twibbon.users.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">
                    {twibbon.supporterCount.toLocaleString()} supporters
                  </span>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
                  <h2 className="text-xl font-bold">About This Campaign</h2>
                </div>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 gap-3">
                  <h3 className="text-xl font-bold text-white">
                    {twibbon.name}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {twibbon.description || "No description provided."}
                  </p>
                  <p className="text-sm text-gray-300  flex items-center gap-2">
                    <span>🗓️</span>
                    Created on {createdDate}
                  </p>
                </Card>
              </div>

              {/* URL Section */}
              <div className="space-y-3">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={twibbonUrl}
                      readOnly
                      className="flex-1 bg-transparent border-none text-white outline-none"
                    />
                    <Button
                      onClick={handleCopyUrl}
                      size="icon"
                      variant="ghost"
                      className="text-white hover:text-cyan-300 hover:bg-white/10 shrink-0"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={twibbon.publicUrl}
              alt={twibbon.name}
              className="w-full h-auto"
            />
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
