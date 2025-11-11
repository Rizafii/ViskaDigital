import { createClient } from "@/lib/supabase/client";

export interface UploadTwibbonData {
  file: File;
  name: string;
  description: string;
  customUrl: string;
}

export interface TwibbonResponse {
  success: boolean;
  data?: {
    uid: number;
    name: string;
    description: string;
    path: string;
    url: string;
  };
  error?: string;
}

/**
 * Upload twibbon to Supabase Storage and save metadata to database
 */
export async function uploadTwibbon(
  data: UploadTwibbonData
): Promise<TwibbonResponse> {
  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Anda harus login terlebih dahulu",
      };
    }

    // Check if custom URL already exists
    const { data: existingTwibbon } = await supabase
      .from("twibone")
      .select("url")
      .eq("url", data.customUrl)
      .single();

    if (existingTwibbon) {
      return {
        success: false,
        error: "Custom URL sudah digunakan. Silakan pilih URL lain.",
      };
    }

    // Generate unique filename
    const fileExt = data.file.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("twibbons")
      .upload(filePath, data.file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        error: "Gagal mengunggah file. Silakan coba lagi.",
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("twibbons").getPublicUrl(filePath);

    // Save twibbon metadata to database
    const { data: twibbonData, error: dbError } = await supabase
      .from("twibone")
      .insert({
        name: data.name,
        description: data.description || null,
        users_uid: user.id,
        path: filePath,
        url: data.customUrl,
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, delete uploaded file
      await supabase.storage.from("twibbons").remove([filePath]);

      console.error("Database error:", dbError);
      return {
        success: false,
        error: "Gagal menyimpan data twibbon. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      data: {
        uid: twibbonData.uid,
        name: twibbonData.name,
        description: twibbonData.description,
        path: twibbonData.path,
        url: twibbonData.url,
      },
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga. Silakan coba lagi.",
    };
  }
}

/**
 * Delete twibbon from storage and database
 */
export async function deleteTwibbon(
  twibbonUid: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Anda harus login terlebih dahulu",
      };
    }

    // Get twibbon data
    const { data: twibbon, error: fetchError } = await supabase
      .from("twibone")
      .select("path, users_uid")
      .eq("uid", twibbonUid)
      .single();

    if (fetchError || !twibbon) {
      return {
        success: false,
        error: "Twibbon tidak ditemukan",
      };
    }

    // Check ownership
    if (twibbon.users_uid !== user.id) {
      return {
        success: false,
        error: "Anda tidak memiliki akses untuk menghapus twibbon ini",
      };
    }

    // Delete from database first
    const { error: dbError } = await supabase
      .from("twibone")
      .delete()
      .eq("uid", twibbonUid);

    if (dbError) {
      console.error("Database delete error:", dbError);
      return {
        success: false,
        error: "Gagal menghapus data twibbon",
      };
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from("twibbons")
      .remove([twibbon.path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Don't return error as database record is already deleted
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga",
    };
  }
}

/**
 * Get user's twibbons
 */
export async function getUserTwibbons() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const { data: twibbons, error } = await supabase
      .from("twibone")
      .select("*")
      .eq("users_uid", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return {
        success: false,
        error: "Gagal mengambil data twibbon",
      };
    }

    // Add public URLs to twibbons
    const twibbonsWithUrls = twibbons.map((twibbon) => ({
      ...twibbon,
      publicUrl: supabase.storage
        .from("twibbons")
        .getPublicUrl(twibbon.path).data.publicUrl,
    }));

    return { success: true, data: twibbonsWithUrls };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga",
    };
  }
}
