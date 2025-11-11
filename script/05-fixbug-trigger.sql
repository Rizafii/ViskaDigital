-- Disable RLS pada tabel users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Atau jika ingin tetap pakai RLS, buat policy ini:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy untuk insert via trigger
DROP POLICY IF EXISTS "Allow auth trigger to insert users" ON public.users;
CREATE POLICY "Allow auth trigger to insert users" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- Policy untuk user bisa lihat data sendiri
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" 
ON public.users FOR SELECT 
USING (auth.uid() = uid);

-- Policy untuk user bisa update data sendiri
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = uid);