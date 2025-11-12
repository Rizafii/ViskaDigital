import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/**
 * Upload file to Supabase storage
 * @param bucket - Bucket name (e.g., 'profiles', 'banners', 'twibbons')
 * @param path - File path (e.g., 'userid/filename.jpg')
 * @param file - File object to upload
 * @returns Object with success status and data/error
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true, // Replace if file already exists
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path)

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

/**
 * Delete file from Supabase storage
 * @param bucket - Bucket name
 * @param path - File path to delete
 * @returns Object with success status
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const supabase = createClientComponentClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

/**
 * Get public URL for a file
 * @param bucket - Bucket name
 * @param path - File path
 * @returns Public URL
 */
export function getPublicUrl(bucket: string, path: string) {
  const supabase = createClientComponentClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
