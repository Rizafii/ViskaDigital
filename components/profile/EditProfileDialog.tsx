"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/supabase/storage";
import { updateCreatorData } from "@/lib/supabase/creator";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess?: () => void;
  initialData?: {
    bio?: string;
    photo_profile_path?: string;
    banner_photo_path?: string;
  };
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
  initialData,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(initialData?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(
    initialData?.photo_profile_path || ""
  );
  const [bannerPreview, setBannerPreview] = useState<string>(
    initialData?.banner_photo_path || ""
  );
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    if (initialData?.photo_profile_path) {
      await deleteFile("profiles", initialData.photo_profile_path);
    }
    setProfilePhoto(null);
    setProfilePreview("");
  };

  const handleRemoveBannerPhoto = async () => {
    if (initialData?.banner_photo_path) {
      await deleteFile("banners", initialData.banner_photo_path);
    }
    setBannerPhoto(null);
    setBannerPreview("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let profilePath = initialData?.photo_profile_path;
      let bannerPath = initialData?.banner_photo_path;

      if (profilePhoto) {
        const ext = profilePhoto.name.split(".").pop();
        const filename = `${user.id}/profile-${Date.now()}.${ext}`;
        const uploadResult = await uploadFile(
          "profiles",
          filename,
          profilePhoto
        );

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload profile photo");
          return;
        }

        profilePath = uploadResult.data?.path;
      }

      if (bannerPhoto) {
        const ext = bannerPhoto.name.split(".").pop();
        const filename = `${user.id}/banner-${Date.now()}.${ext}`;
        const uploadResult = await uploadFile("banners", filename, bannerPhoto);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload banner photo");
          return;
        }

        bannerPath = uploadResult.data?.path;
      }

      const result = await updateCreatorData(user.id, {
        bio: bio || undefined,
        photo_profile_path: profilePath,
        banner_photo_path: bannerPath,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update creator data");
        return;
      }

      toast.success("Profile updated successfully");

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="resize-none h-24"
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/255</p>
          </div>

          {/* Profile Photo Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Photo</label>
            <div className="flex gap-4">
              {profilePreview && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={profilePreview || "/placeholder.svg"}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveProfilePhoto}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button
                onClick={() => profileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-full hover:border-primary hover:bg-accent transition-colors"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">
                  Upload
                </span>
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Banner Photo Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Photo</label>
            <div className="space-y-2">
              {bannerPreview && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-border">
                  <Image
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveBannerPhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload banner
                  </span>
                </div>
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerPhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
