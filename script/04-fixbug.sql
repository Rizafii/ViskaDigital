-- 1. Drop trigger dan function yang lama
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Buat function baru dengan SECURITY DEFINER yang benar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    default_role_id BIGINT;
BEGIN
    -- Ambil role_uid default (role 'user')
    SELECT uid INTO default_role_id 
    FROM public.role 
    WHERE role_name = 'user' 
    LIMIT 1;
    
    -- Jika tidak ada role default, raise exception
    IF default_role_id IS NULL THEN
        RAISE EXCEPTION 'Default role "user" not found in role table';
    END IF;

    -- Insert ke tabel users dengan error handling
    INSERT INTO public.users (uid, name, email, role_uid, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name', 
            NEW.raw_user_meta_data->>'full_name', 
            split_part(NEW.email, '@', 1)
        ),
        NEW.email,
        default_role_id,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RAISE WARNING 'User with email % already exists', NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating user record: %', SQLERRM;
        RETURN NEW; -- Return NEW instead of raising to allow auth signup
END;
$$ LANGUAGE plpgsql;

-- 3. Grant permissions yang diperlukan
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.role TO authenticated;

-- 4. Buat trigger baru
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. Verifikasi trigger terpasang
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';