-- Step 6: Setup Storage Buckets and Policies
-- This script creates storage buckets for twibbon files and profile photos

-- Create storage bucket for twibbons
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'twibbons',
  'twibbons',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for twibbons bucket
-- Allow authenticated users to upload twibbons
CREATE POLICY "Authenticated users can upload twibbons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'twibbons' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view twibbons
CREATE POLICY "Public can view twibbons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'twibbons');

-- Allow users to update their own twibbons
CREATE POLICY "Users can update own twibbons"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'twibbons' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own twibbons
CREATE POLICY "Users can delete own twibbons"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'twibbons' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for profiles bucket
-- Allow authenticated users to upload profile photos
CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view profile photos
CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Allow users to update their own profile photos
CREATE POLICY "Users can update own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile photos
CREATE POLICY "Users can delete own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
