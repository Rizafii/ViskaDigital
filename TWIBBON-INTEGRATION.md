# Upload Twibbon - Integrasi Supabase

Implementasi upload twibbon ke Supabase Storage dengan metadata tersimpan di database.

## ✨ Fitur

- ✅ Upload file PNG (max 5MB)
- ✅ Validasi format dan ukuran file
- ✅ Preview gambar sebelum upload
- ✅ Custom URL untuk setiap twibbon (unique)
- ✅ Responsive layout (mobile & desktop)
- ✅ Auto-organize file per user ID
- ✅ Row Level Security (RLS) enabled
- ✅ Success/error notification

## 🗂️ File Structure

```
lib/supabase/
  └── twibbon.ts          # API functions untuk twibbon

components/modal/
  └── UploadTwibbon.tsx   # Modal component upload twibbon

script/
  ├── 06-storage-setup.sql       # SQL setup storage buckets
  └── STORAGE-SETUP-GUIDE.md     # Panduan setup storage
```

## 🚀 Setup

### 1. Setup Database & Storage

Jalankan semua SQL scripts di Supabase SQL Editor:

```bash
# Di Supabase Dashboard > SQL Editor
01-init-database.sql     # ✅ (sudah)
02-seed-roles.sql        # ✅ (sudah)
03-auth-trigger.sql      # ✅ (sudah)
04-fixbug.sql           # ✅ (sudah)
05-fixbug-trigger.sql   # ✅ (sudah)
06-storage-setup.sql    # ⚠️ WAJIB! (baru)
```

### 2. Verifikasi Storage Buckets

1. Buka **Storage** di Supabase Dashboard
2. Pastikan ada 2 buckets:
   - `twibbons` (Public, PNG only, 5MB max)
   - `profiles` (Public, Image formats, 2MB max)

### 3. Environment Variables

Pastikan `.env.local` sudah benar:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📖 Usage

### Upload Twibbon Component

```tsx
import UploadTwibbon from "@/components/modal/UploadTwibbon";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Upload Twibbon</button>

      {showModal && (
        <UploadTwibbon
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Refresh data atau tampilkan notifikasi
            console.log("Upload berhasil!");
          }}
        />
      )}
    </>
  );
}
```

### API Functions

#### 1. Upload Twibbon

```typescript
import { uploadTwibbon } from "@/lib/supabase/twibbon";

const result = await uploadTwibbon({
  file: fileObject, // File object dari input
  name: "Twibbon HUT RI", // Nama twibbon
  description: "Deskripsi...", // Optional
  customUrl: "hut-ri-79", // Unique URL slug
});

if (result.success) {
  console.log("Upload success:", result.data);
  // {
  //   uid: 1,
  //   name: "Twibbon HUT RI",
  //   description: "Deskripsi...",
  //   path: "user-id/timestamp-random.png",
  //   url: "hut-ri-79"
  // }
} else {
  console.error("Upload failed:", result.error);
}
```

#### 2. Get User's Twibbons

```typescript
import { getUserTwibbons } from "@/lib/supabase/twibbon";

const result = await getUserTwibbons();

if (result.success) {
  console.log("Twibbons:", result.data);
  // Array of twibbons with publicUrl included
}
```

#### 3. Delete Twibbon

```typescript
import { deleteTwibbon } from "@/lib/supabase/twibbon";

const result = await deleteTwibbon(twibbonUid);

if (result.success) {
  console.log("Deleted successfully");
}
```

## 🎨 Layout Features

### Desktop Layout

- **Left side (1/3)**: File preview
- **Right side (2/3)**: Form fields
- Preview lebih besar dan proporsional

### Mobile Layout

- **Vertical stack**: Full width
- File preview di atas
- Form fields di bawah

## 🔒 Security

### Storage Policies

1. **Upload**: User hanya bisa upload ke folder mereka sendiri

   ```
   Path format: {user_id}/{filename}
   ```

2. **View**: Public bisa melihat semua file (untuk sharing)

3. **Update/Delete**: User hanya bisa edit/hapus file mereka sendiri

### Validation

- **File Type**: Hanya PNG
- **File Size**: Max 5MB
- **Custom URL**: Unique (dicek sebelum upload)
- **Authentication**: Wajib login

## 🗄️ Database Schema

```sql
CREATE TABLE "twibone" (
  "uid" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NULL,
  "users_uid" UUID NOT NULL,
  "path" VARCHAR(255) NOT NULL UNIQUE,
  "url" VARCHAR(255) NOT NULL UNIQUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY("users_uid") REFERENCES "users"("uid")
);
```

## 📦 Storage Structure

```
supabase-storage/
└── twibbons/
    ├── user-uuid-1/
    │   ├── 1699707600000-abc123.png
    │   └── 1699707700000-xyz789.png
    └── user-uuid-2/
        └── 1699707800000-def456.png
```

## 🐛 Troubleshooting

### Error: "Failed to upload file"

**Solusi:**

1. Pastikan script `06-storage-setup.sql` sudah dijalankan
2. Verifikasi bucket `twibbons` ada di Storage
3. Check file size < 5MB dan format PNG

### Error: "Custom URL sudah digunakan"

**Solusi:**

- Gunakan URL yang berbeda/unique

### Error: "Anda harus login terlebih dahulu"

**Solusi:**

- Login ke aplikasi terlebih dahulu
- Check session di browser DevTools

### Preview tidak muncul

**Solusi:**

- Check console untuk error
- Pastikan file valid PNG
- Clear browser cache

## 🎯 Next Features

- [ ] Halaman list twibbon user
- [ ] Public view twibbon page
- [ ] Edit twibbon metadata
- [ ] Duplicate detection
- [ ] Bulk upload
- [ ] Image optimization
- [ ] Usage statistics

## 📚 References

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)

---

**Author**: ViskaDigital Team  
**Last Updated**: November 11, 2025
