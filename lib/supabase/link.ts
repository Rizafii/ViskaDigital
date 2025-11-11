import { createClient } from "@/lib/supabase/client";

export interface CreateLinkData {
  name: string;
  description: string;
  originalLink: string;
  customShortLink?: string; // Optional custom short link
}

export interface LinkResponse {
  success: boolean;
  data?: {
    uid: number;
    name: string;
    description: string | null;
    original_link: string;
    short_link: string;
    active: boolean;
  };
  error?: string;
}

/**
 * Generate random short link slug
 */
function generateShortLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a new short link
 */
export async function createLink(
  data: CreateLinkData
): Promise<LinkResponse> {
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

    // Generate or use custom short link
    let shortLink = "";
    
    if (data.customShortLink && data.customShortLink.trim()) {
      // Use custom short link provided by user
      shortLink = data.customShortLink.trim();
      
      // Check if custom short link already exists
      const { data: existingLink } = await supabase
        .from("link")
        .select("short_link")
        .eq("short_link", shortLink)
        .single();

      if (existingLink) {
        return {
          success: false,
          error: "Short link sudah digunakan. Silakan pilih yang lain.",
        };
      }
    } else {
      // Generate random short link
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        shortLink = generateShortLink();

        // Check if short link already exists
        const { data: existingLink } = await supabase
          .from("link")
          .select("short_link")
          .eq("short_link", shortLink)
          .single();

        if (!existingLink) {
          break; // Short link is unique
        }

        attempts++;
      }

      if (attempts === maxAttempts) {
        return {
          success: false,
          error: "Gagal generate short link unik. Silakan coba lagi.",
        };
      }
    }

    // Insert link to database
    const { data: linkData, error: dbError } = await supabase
      .from("link")
      .insert({
        name: data.name,
        description: data.description || null,
        original_link: data.originalLink,
        short_link: shortLink,
        users_uid: user.id,
        active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        error: "Gagal menyimpan link. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      data: {
        uid: linkData.uid,
        name: linkData.name,
        description: linkData.description,
        original_link: linkData.original_link,
        short_link: linkData.short_link,
        active: linkData.active,
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
 * Get user's links
 */
export async function getUserLinks() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const { data: links, error } = await supabase
      .from("link")
      .select("*")
      .eq("users_uid", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return {
        success: false,
        error: "Gagal mengambil data link",
      };
    }

    return { success: true, data: links };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga",
    };
  }
}

/**
 * Update link status (active/inactive)
 */
export async function updateLinkStatus(
  linkUid: number,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

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

    // Check ownership
    const { data: link, error: fetchError } = await supabase
      .from("link")
      .select("users_uid")
      .eq("uid", linkUid)
      .single();

    if (fetchError || !link) {
      return {
        success: false,
        error: "Link tidak ditemukan",
      };
    }

    if (link.users_uid !== user.id) {
      return {
        success: false,
        error: "Anda tidak memiliki akses untuk mengubah link ini",
      };
    }

    // Update link status
    const { error: updateError } = await supabase
      .from("link")
      .update({ active, updated_at: new Date().toISOString() })
      .eq("uid", linkUid);

    if (updateError) {
      console.error("Update error:", updateError);
      return {
        success: false,
        error: "Gagal mengubah status link",
      };
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
 * Delete link
 */
export async function deleteLink(
  linkUid: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

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

    // Check ownership
    const { data: link, error: fetchError } = await supabase
      .from("link")
      .select("users_uid")
      .eq("uid", linkUid)
      .single();

    if (fetchError || !link) {
      return {
        success: false,
        error: "Link tidak ditemukan",
      };
    }

    if (link.users_uid !== user.id) {
      return {
        success: false,
        error: "Anda tidak memiliki akses untuk menghapus link ini",
      };
    }

    // Delete link
    const { error: deleteError } = await supabase
      .from("link")
      .delete()
      .eq("uid", linkUid);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return {
        success: false,
        error: "Gagal menghapus link",
      };
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
 * Get link statistics
 */
export async function getLinkStats(linkUid: number) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    // Check ownership
    const { data: link, error: fetchError } = await supabase
      .from("link")
      .select("users_uid")
      .eq("uid", linkUid)
      .single();

    if (fetchError || !link) {
      return {
        success: false,
        error: "Link tidak ditemukan",
      };
    }

    if (link.users_uid !== user.id) {
      return {
        success: false,
        error: "Anda tidak memiliki akses untuk melihat statistik link ini",
      };
    }

    // Get click statistics
    const { data: clicks, error: clickError } = await supabase
      .from("link_click")
      .select("*")
      .eq("link_uid", linkUid)
      .order("created_at", { ascending: false });

    if (clickError) {
      console.error("Fetch error:", clickError);
      return {
        success: false,
        error: "Gagal mengambil statistik link",
      };
    }

    return {
      success: true,
      data: {
        totalClicks: clicks.length,
        clicks: clicks,
      },
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga",
    };
  }
}

/**
 * Record link click (for public access)
 */
export async function recordLinkClick(
  shortLink: string,
  ipAddress: string,
  userAgent: string
): Promise<{ success: boolean; originalLink?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Get link by short_link
    const { data: link, error: fetchError } = await supabase
      .from("link")
      .select("uid, original_link, active")
      .eq("short_link", shortLink)
      .single();

    if (fetchError || !link) {
      return {
        success: false,
        error: "Link tidak ditemukan",
      };
    }

    if (!link.active) {
      return {
        success: false,
        error: "Link tidak aktif",
      };
    }

    // Record click
    const { error: insertError } = await supabase
      .from("link_click")
      .insert({
        link_uid: link.uid,
        ip_address: ipAddress,
        agent: userAgent,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      // Don't fail the redirect if click recording fails
    }

    return {
      success: true,
      originalLink: link.original_link,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan tidak terduga",
    };
  }
}
