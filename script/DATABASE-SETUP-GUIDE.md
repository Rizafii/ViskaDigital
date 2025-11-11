# Database Setup Guide

Masalah registration Anda terjadi karena **database belum di-setup**. Database schema dan trigger belum dibuat, sehingga tidak ada link antara Supabase Auth dengan tabel `users`.

## 📋 Setup Steps (WAJIB DIJALANKAN!)

Ada 7 file SQL yang harus dijalankan **dalam urutan ini**:

1. **`scripts/01-init-database.sql`** - Membuat semua tabel
2. **`scripts/02-seed-roles.sql`** - Insert default roles
3. **`scripts/03-auth-trigger.sql`** - Membuat trigger untuk auto-sync auth ke users
4. **`scripts/04-fixbug.sql`** - Fix bugs (jika ada)
5. **`scripts/05-fixbug-trigger.sql`** - Fix trigger bugs (jika ada)
6. **`scripts/06-storage-setup.sql`** - Setup Storage buckets untuk twibbon & profiles
7. **`scripts/07-rls-policies.sql`** - ⚠️ **PENTING!** Enable RLS dan create policies

## 🚀 Cara Setup (Pilih Salah Satu)

### Option 1: Via Supabase Dashboard (Recommended)

1. Buka **https://app.supabase.com** dan masuk ke project Anda
2. Pergi ke **SQL Editor** → klik **New Query**
3. **Copy-paste** semua isi dari **`scripts/01-init-database.sql`** dan klik **RUN**
4. Tunggu sampai selesai (hijau ✓)
5. **New Query** lagi, copy-paste **`scripts/02-seed-roles.sql`** dan **RUN**
6. Tunggu sampai selesai
7. **New Query** lagi, copy-paste **`scripts/03-auth-trigger.sql`** dan **RUN**
8. **New Query** lagi, copy-paste **`scripts/06-storage-setup.sql`** dan **RUN**
9. **New Query** lagi, copy-paste **`scripts/07-rls-policies.sql`** dan **RUN** ⚠️ **PENTING!**
10. Done! 🎉

### Option 2: Via Supabase CLI

\`\`\`bash

# Install Supabase CLI jika belum

npm install -g supabase

# Login ke Supabase

supabase login

# Link project Anda

supabase link --project-ref YOUR_PROJECT_ID

# Push database migrations

supabase db push
\`\`\`

## 🧪 Verifikasi Setup

Setelah setup, buka SQL Editor dan jalankan query ini untuk verifikasi:

\`\`\`sql
-- Cek apakah roles sudah ada
SELECT \* FROM "role";

-- Seharusnya result:
-- uid | role_name | created_at | updated_at
-- 1 | user | 2024-11-11 ... | 2024-11-11 ...
-- 2 | creator | 2024-11-11 ... | 2024-11-11 ...
-- 3 | admin | 2024-11-11 ... | 2024-11-11 ...
\`\`\`

## 🧬 Cara Kerja Trigger

Setelah setup selesai, berikut cara flow-nya:

1. User mengisi form register dan submit
2. Supabase Auth membuat entry di `auth.users`
3. Trigger `on_auth_user_created` otomatis terpicu
4. Trigger memanggil function `handle_new_user()`
5. Function membuat entry di tabel `users` dengan:
   - `uid` (UUID dari auth.users.id)
   - `name` (dari display_name di metadata)
   - `email` (dari auth.users.email)
   - `role_uid` = 1 (role "user")

## ❌ Troubleshooting

### Jika masih error setelah setup:

1. **Cek apakah roles ada:**
   \`\`\`sql
   SELECT \* FROM "role";
   \`\`\`

2. **Cek apakah trigger terpasang:**
   \`\`\`sql
   SELECT trigger_name FROM information_schema.triggers
   WHERE event_object_table = 'users';
   \`\`\`

3. **Lihat error detail di Logs:**

   - Buka Supabase Dashboard → **Logs** → **Postgres Logs**
   - Cari error messages terbaru

4. **Check auth.users table:**
   \`\`\`sql
   SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
   \`\`\`

5. **Check users table:**
   \`\`\`sql
   SELECT uid, name, email, created_at FROM users ORDER BY created_at DESC;
   \`\`\`

## 📚 Schema Overview

\`\`\`
auth.users (managed by Supabase)
↓ (trigger: on_auth_user_created)
users table
├── uid (FK dari auth.users.id)
├── name
├── email
├── role_uid (FK ke role table)
├── created_at
└── updated_at

role table
├── uid (1, 2, 3 - auto-increment)
├── role_name (user, creator, admin)
├── created_at
└── updated_at
\`\`\`

## 🎯 Next Steps

Setelah database setup selesai:

1. ✅ Test register dari aplikasi
2. ✅ Verifikasi user berhasil masuk ke tabel `users`
3. ✅ Test login
4. ✅ Test upload twibbon (lihat **STORAGE-SETUP-GUIDE.md**)
5. ✅ Mulai build fitur lainnya (link, twibbon, dll)

## 📦 Storage Setup

Untuk setup Storage bucket dan upload twibbon, lihat:

- **`scripts/STORAGE-SETUP-GUIDE.md`** - Panduan lengkap Storage setup

---

**Need help?** Check the logs in Supabase Dashboard or contact support at vercel.com/help
