-- Step 7: Enable Row Level Security (RLS) and Create Policies
-- This script enables RLS and creates policies for all tables

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "link" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "link_click" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "twibone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "twibone_used" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "creator_data" ENABLE ROW LEVEL SECURITY;
-- Note: "role" table tidak perlu RLS karena bersifat read-only reference

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "users" FOR SELECT
TO authenticated
USING (auth.uid() = uid);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "users" FOR UPDATE
TO authenticated
USING (auth.uid() = uid);

-- System can insert users (via trigger)
CREATE POLICY "System can insert users"
ON "users" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uid);

-- =============================================
-- LINK TABLE POLICIES
-- =============================================

-- Users can view their own links
CREATE POLICY "Users can view own links"
ON "link" FOR SELECT
TO authenticated
USING (auth.uid() = users_uid);

-- Users can insert their own links
CREATE POLICY "Users can insert own links"
ON "link" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = users_uid);

-- Users can update their own links
CREATE POLICY "Users can update own links"
ON "link" FOR UPDATE
TO authenticated
USING (auth.uid() = users_uid);

-- Users can delete their own links
CREATE POLICY "Users can delete own links"
ON "link" FOR DELETE
TO authenticated
USING (auth.uid() = users_uid);

-- =============================================
-- LINK_CLICK TABLE POLICIES
-- =============================================

-- Users can view clicks for their own links
CREATE POLICY "Users can view own link clicks"
ON "link_click" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "link"
    WHERE "link".uid = "link_click".link_uid
    AND "link".users_uid = auth.uid()
  )
);

-- Anyone can insert link clicks (for tracking)
CREATE POLICY "Anyone can insert link clicks"
ON "link_click" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =============================================
-- TWIBONE TABLE POLICIES
-- =============================================

-- Public can view all twibbons (for sharing)
CREATE POLICY "Public can view all twibbons"
ON "twibone" FOR SELECT
TO anon, authenticated
USING (true);

-- Users can insert their own twibbons
CREATE POLICY "Users can insert own twibbons"
ON "twibone" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = users_uid);

-- Users can update their own twibbons
CREATE POLICY "Users can update own twibbons"
ON "twibone" FOR UPDATE
TO authenticated
USING (auth.uid() = users_uid);

-- Users can delete their own twibbons
CREATE POLICY "Users can delete own twibbons"
ON "twibone" FOR DELETE
TO authenticated
USING (auth.uid() = users_uid);

-- =============================================
-- TWIBONE_USED TABLE POLICIES
-- =============================================

-- Users can view usage stats for their own twibbons
CREATE POLICY "Users can view own twibbon usage"
ON "twibone_used" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "twibone"
    WHERE "twibone".uid = "twibone_used".twibone_uid
    AND "twibone".users_uid = auth.uid()
  )
);

-- Anyone can insert twibbon usage (for tracking)
CREATE POLICY "Anyone can insert twibbon usage"
ON "twibone_used" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =============================================
-- CREATOR_DATA TABLE POLICIES
-- =============================================

-- Public can view all creator profiles
CREATE POLICY "Public can view creator profiles"
ON "creator_data" FOR SELECT
TO anon, authenticated
USING (true);

-- Users can insert their own creator data
CREATE POLICY "Users can insert own creator data"
ON "creator_data" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = users_uid);

-- Users can update their own creator data
CREATE POLICY "Users can update own creator data"
ON "creator_data" FOR UPDATE
TO authenticated
USING (auth.uid() = users_uid);

-- Users can delete their own creator data
CREATE POLICY "Users can delete own creator data"
ON "creator_data" FOR DELETE
TO authenticated
USING (auth.uid() = users_uid);

-- =============================================
-- ROLE TABLE - No RLS needed (read-only reference)
-- =============================================
-- The role table is a reference table that everyone can read
-- No need for RLS as it's managed by admin only

-- Grant read access to all authenticated users
GRANT SELECT ON "role" TO authenticated;
GRANT SELECT ON "role" TO anon;
