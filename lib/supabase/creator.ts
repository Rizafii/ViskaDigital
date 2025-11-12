import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/**
 * Get creator data for a user (Client-side)
 */
export async function getCreatorData(userId: string) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("creator_data").select("*").eq("users_uid", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is OK
      throw error
    }

    return { success: true, data: data || null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch creator data",
    }
  }
}

/**
 * Update creator data for a user (Client-side)
 */
export async function updateCreatorData(
  userId: string,
  data: {
    bio?: string
    photo_profile_path?: string
    banner_photo_path?: string
  },
) {
  try {
    const supabase = createClientComponentClient()

    const { data: result, error } = await supabase
      .from("creator_data")
      .upsert(
        {
          users_uid: userId,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "users_uid" },
      )
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update creator data",
    }
  }
}
