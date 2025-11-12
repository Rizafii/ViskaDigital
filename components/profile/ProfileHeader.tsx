"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Share2, PencilIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import EditProfileDialog from "./EditProfileDialog";
import { getCreatorData } from "@/lib/supabase/creator";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [loadingCreatorData, setLoadingCreatorData] = useState(true);

  const userName = user.user_metadata?.full_name || "User Profile";
  const username = user.email?.split("@")[0] || "user";

  useEffect(() => {
    const fetchCreatorData = async () => {
      const result = await getCreatorData(user.id);
      if (result.success) {
        setCreatorData(result.data);
      }
      setLoadingCreatorData(false);
    };
    fetchCreatorData();
  }, [user.id]);

  const profilePhotoUrl = creatorData?.photo_profile_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/${creatorData.photo_profile_path}`
    : user.user_metadata?.avatar_url;

  const bannerUrl = creatorData?.banner_photo_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/${creatorData.banner_photo_path}`
    : undefined;

  return (
    <>
      <div
        className={`${
          bannerUrl ? "" : "bg-gradient-to-br from-cyan-100 to-teal-50"
        } pt-0 pb-0`}
      >
        {bannerUrl && (
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={bannerUrl || "/placeholder.svg"}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 md:px-12 pt-8 pb-6">
          <div className="flex items-start justify-between">
            <div className="relative -mt-16">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-gray-200">
                <AvatarImage
                  src={profilePhotoUrl || "/placeholder.svg"}
                  alt={userName}
                />
                <AvatarFallback className="bg-gray-200 text-gray-400 text-4xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setEditOpen(true)}
                className="absolute bottom-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-md border border-gray-200"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="rounded-full gap-2 bg-transparent border-gray-300"
                onClick={() => setEditOpen(true)}
              >
                <PencilIcon className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border-gray-300"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-foreground">
              {userName.toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">@{username}</p>
          </div>
        </div>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        initialData={creatorData}
        onSuccess={() => {
          const fetchCreatorData = async () => {
            const result = await getCreatorData(user.id);
            if (result.success) {
              setCreatorData(result.data);
            }
          };
          fetchCreatorData();
        }}
      />
    </>
  );
}
