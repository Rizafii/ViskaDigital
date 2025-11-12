-- Step 8: Setup Banners Storage Bucket and Policies
-- This script creates storage bucket for banner photos

-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
-- Allow authenticated users to upload banners
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view banners
CREATE POLICY "Public can view banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Allow users to update their own banners
CREATE POLICY "Users can update own banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own banners
CREATE POLICY "Users can delete own banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
