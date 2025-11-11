-- Step 3: Create auth trigger and functions
-- This trigger automatically creates a user record when someone signs up via auth

-- Function untuk membuat user di tabel users otomatis saat register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id BIGINT;
BEGIN
    -- Ambil role_uid default (role 'user')
    SELECT uid INTO default_role_id FROM "role" WHERE role_name = 'user' LIMIT 1;
    
    -- Jika tidak ada role default, raise exception
    IF default_role_id IS NULL THEN
        RAISE EXCEPTION 'Default role "user" not found. Please run seed-roles.sql first.';
    END IF;

    -- Insert ke tabel users
    INSERT INTO public.users (uid, name, email, role_uid, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        default_role_id,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error (akan muncul di Supabase logs)
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        -- Re-raise the exception to prevent user creation
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger jika sudah ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger yang akan dijalankan setelah user baru dibuat di auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers untuk auto-update updated_at di semua tabel
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_role ON public.role;
CREATE TRIGGER set_updated_at_role
    BEFORE UPDATE ON public.role
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_link ON public.link;
CREATE TRIGGER set_updated_at_link
    BEFORE UPDATE ON public.link
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_twibone ON public.twibone;
CREATE TRIGGER set_updated_at_twibone
    BEFORE UPDATE ON public.twibone
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_creator_data ON public.creator_data;
CREATE TRIGGER set_updated_at_creator_data
    BEFORE UPDATE ON public.creator_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
