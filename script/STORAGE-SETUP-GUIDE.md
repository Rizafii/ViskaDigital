# Setup Supabase Storage for Twibbons

Panduan ini menjelaskan cara setup Supabase Storage untuk menyimpan file twibbon dan foto profil.

## Prerequisites

- Akun Supabase aktif
- Project Supabase sudah dibuat
- Database sudah disetup (jalankan script 01-05 terlebih dahulu)

## Langkah-langkah Setup

### 1. Jalankan SQL Script untuk Storage

Buka **SQL Editor** di Supabase Dashboard dan jalankan script `06-storage-setup.sql`:

```bash
# Lokasi file
script/06-storage-setup.sql
```

Script ini akan:

- Membuat bucket `twibbons` untuk menyimpan file twibbon (PNG, max 5MB)
- Membuat bucket `profiles` untuk foto profil (JPEG/PNG/WebP, max 2MB)
- Setup RLS policies untuk keamanan:
  - User dapat upload file ke folder mereka sendiri
  - Public dapat melihat semua file
  - User hanya dapat update/delete file mereka sendiri

### 2. Verifikasi Buckets

1. Buka **Storage** di Supabase Dashboard
2. Pastikan ada 2 buckets:
   - `twibbons` (Public)
   - `profiles` (Public)

### 3. Struktur Folder

File akan disimpan dengan struktur:

```
twibbons/
  └── {user_id}/
      └── {timestamp}-{random}.png

profiles/
  └── {user_id}/
      └── {timestamp}-{random}.{jpg|png|webp}
```

### 4. Testing Upload

Untuk testing upload twibbon:

1. Login ke aplikasi
2. Klik tombol "Upload Twibbon"
3. Upload file PNG (max 5MB)
4. Isi form (Nama, Custom URL, Deskripsi)
5. Klik "Upload Twibbon"

### 5. Environment Variables

Pastikan file `.env.local` memiliki:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Struktur Database

Tabel `twibone` menyimpan metadata twibbon:

| Column      | Type         | Description          |
| ----------- | ------------ | -------------------- |
| uid         | BIGSERIAL    | Primary key          |
| name        | VARCHAR(255) | Nama twibbon         |
| description | VARCHAR(255) | Deskripsi (optional) |
| users_uid   | UUID         | User ID pemilik      |
| path        | VARCHAR(255) | Path file di storage |
| url         | VARCHAR(255) | Custom URL (unique)  |
| created_at  | TIMESTAMP    | Waktu dibuat         |
| updated_at  | TIMESTAMP    | Waktu diupdate       |

## Storage Policies

### Twibbons Bucket Policies

1. **Insert Policy**: User hanya bisa upload ke folder mereka sendiri

   ```sql
   bucket_id = 'twibbons' AND
   auth.uid()::text = (storage.foldername(name))[1]
   ```

2. **Select Policy**: Public bisa melihat semua file

   ```sql
   bucket_id = 'twibbons'
   ```

3. **Update/Delete Policy**: User hanya bisa update/delete file mereka sendiri
   ```sql
   bucket_id = 'twibbons' AND
   auth.uid()::text = (storage.foldername(name))[1]
   ```

## API Functions

### `uploadTwibbon(data: UploadTwibbonData)`

Upload twibbon ke Supabase Storage dan simpan metadata ke database.

**Parameters:**

```typescript
{
  file: File; // File PNG (max 5MB)
  name: string; // Nama twibbon
  description: string; // Deskripsi
  customUrl: string; // Custom URL (unique)
}
```

**Returns:**

```typescript
{
  success: boolean;
  data?: {
    uid: number;
    name: string;
    description: string;
    path: string;
    url: string;
  };
  error?: string;
}
```

### `deleteTwibbon(twibbonUid: number)`

Hapus twibbon dari storage dan database.

**Returns:**

```typescript
{
  success: boolean;
  error?: string;
}
```

### `getUserTwibbons()`

Ambil semua twibbon milik user yang sedang login.

**Returns:**

```typescript
{
  success: boolean;
  data?: Array<{
    uid: number;
    name: string;
    description: string;
    path: string;
    url: string;
    publicUrl: string;
    created_at: string;
    updated_at: string;
  }>;
  error?: string;
}
```

## Troubleshooting

### Error: "Failed to upload file"

**Penyebab:**

- File size lebih dari 5MB
- Format file bukan PNG
- Storage bucket belum dibuat
- RLS policies belum disetup

**Solusi:**

1. Check file size dan format
2. Jalankan script `06-storage-setup.sql`
3. Verifikasi buckets di Supabase Dashboard

### Error: "Custom URL sudah digunakan"

**Penyebab:**

- URL yang diinginkan sudah dipakai user lain

**Solusi:**

- Gunakan custom URL yang berbeda

### Error: "Anda harus login terlebih dahulu"

**Penyebab:**

- User belum login atau session expired

**Solusi:**

- Login ulang ke aplikasi

## Security Notes

1. **File Size Limits**: Enforced di bucket level (5MB untuk twibbons)
2. **File Types**: Hanya PNG untuk twibbons
3. **Row Level Security**: User hanya bisa manipulasi file mereka sendiri
4. **Public Access**: Semua file bisa dilihat public (untuk sharing twibbon)

## Next Steps

Setelah storage setup selesai:

1. ✅ Test upload twibbon
2. ✅ Verifikasi file tersimpan di Storage
3. ✅ Check metadata tersimpan di database
4. 🔲 Implementasi halaman list twibbon user
5. 🔲 Implementasi halaman public view twibbon
6. 🔲 Implementasi fitur edit/delete twibbon
