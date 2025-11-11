# Short Link - Integrasi Supabase

Implementasi pembuatan short link dengan tracking statistik klik menggunakan Supabase.

## ✨ Fitur

- ✅ Generate short link otomatis (6 karakter random)
- ✅ Custom short link (user bisa pilih sendiri)
- ✅ Validasi URL original
- ✅ Link management (create, read, update, delete)
- ✅ Toggle aktif/non-aktif link
- ✅ Click tracking dengan IP & User Agent
- ✅ Statistics per link
- ✅ Row Level Security (RLS) enabled
- ✅ Success notification dengan copy short link
- ✅ Domain prefix di frontend (tidak disimpan di database)

## 🗂️ File Structure

```
lib/supabase/
  └── link.ts              # API functions untuk link

components/modal/
  └── CreateLink.tsx       # Modal component create link
```

## 📖 API Functions

### 1. Create Link

```typescript
import { createLink } from "@/lib/supabase/link";

// Auto-generate short link
const result = await createLink({
  name: "Link Kampanye A",
  description: "Deskripsi...", // Optional
  originalLink: "https://example.com",
});

// OR with custom short link
const result = await createLink({
  name: "Link Kampanye A",
  description: "Deskripsi...", // Optional
  originalLink: "https://example.com",
  customShortLink: "promo-2024", // Optional, akan dicek uniqueness
});

if (result.success) {
  console.log("Short link:", result.data.short_link);
  // Output: "aBc123" atau "promo-2024"
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    uid: 1,
    name: "Link Kampanye A",
    description: "Deskripsi...",
    original_link: "https://example.com",
    short_link: "aBc123",
    active: true
  }
}
```

### 2. Get User Links

```typescript
import { getUserLinks } from "@/lib/supabase/link";

const result = await getUserLinks();

if (result.success) {
  console.log("Links:", result.data);
  // Array of user's links
}
```

### 3. Update Link Status

```typescript
import { updateLinkStatus } from "@/lib/supabase/link";

// Activate link
await updateLinkStatus(linkUid, true);

// Deactivate link
await updateLinkStatus(linkUid, false);
```

### 4. Delete Link

```typescript
import { deleteLink } from "@/lib/supabase/link";

const result = await deleteLink(linkUid);

if (result.success) {
  console.log("Link deleted");
}
```

### 5. Get Link Statistics

```typescript
import { getLinkStats } from "@/lib/supabase/link";

const result = await getLinkStats(linkUid);

if (result.success) {
  console.log("Total clicks:", result.data.totalClicks);
  console.log("Click details:", result.data.clicks);
}
```

### 6. Record Link Click (Public)

```typescript
import { recordLinkClick } from "@/lib/supabase/link";

const result = await recordLinkClick(
  "aBc123", // short link
  "192.168.1.1", // IP address
  "Mozilla/5.0..." // User agent
);

if (result.success) {
  // Redirect to original link
  window.location.href = result.originalLink;
}
```

## 🎨 Component Usage

### CreateLink Modal

```tsx
import CreateLink from "@/components/modal/CreateLink";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Buat Link</button>

      {showModal && (
        <CreateLink
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Refresh list atau tampilkan notifikasi
            console.log("Link berhasil dibuat!");
          }}
        />
      )}
    </>
  );
}
```

## 🔒 Security

### RLS Policies (dari script 07-rls-policies.sql)

1. **SELECT**: User hanya bisa melihat link mereka sendiri
2. **INSERT**: User hanya bisa membuat link untuk diri mereka sendiri
3. **UPDATE**: User hanya bisa update link mereka sendiri
4. **DELETE**: User hanya bisa delete link mereka sendiri

### Link Click Tracking

- **INSERT**: Public/anon bisa insert (untuk tracking)
- **SELECT**: User hanya bisa lihat statistik link mereka sendiri

## 🗄️ Database Schema

### Table: `link`

```sql
CREATE TABLE "link" (
  "uid" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NULL,
  "original_link" VARCHAR(255) NOT NULL,
  "short_link" VARCHAR(255) NOT NULL UNIQUE,
  "users_uid" UUID NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY("users_uid") REFERENCES "users"("uid")
);
```

### Table: `link_click`

```sql
CREATE TABLE "link_click" (
  "uid" BIGSERIAL PRIMARY KEY,
  "link_uid" BIGINT NOT NULL,
  "ip_address" VARCHAR(45) NOT NULL,
  "agent" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY("link_uid") REFERENCES "link"("uid")
);
```

## 🚀 Short Link Format

### Auto-Generated

- **Length**: 6 characters
- **Characters**: a-z, A-Z, 0-9 (62 possible characters)
- **Total combinations**: 62^6 = 56,800,235,584 unique links
- **Collision handling**: Auto-retry up to 10 times

### Custom Short Link

- **Format**: Lowercase alphanumeric + hyphens
- **Allowed**: a-z, 0-9, - (dash)
- **Validation**: Uniqueness check before create
- **Example**: `promo-2024`, `hut-ri-79`, `black-friday`

### Domain Prefix

- **Prefix**: `viska.app/` (displayed in frontend only)
- **Database**: Hanya menyimpan slug (tanpa prefix)
- **Full URL**: `viska.app/{short_link}`

## 📊 Click Tracking

Setiap kali short link diakses, sistem akan:

1. Validasi link exists dan aktif
2. Record click dengan:
   - IP Address
   - User Agent (browser info)
   - Timestamp
3. Redirect ke original URL

## 🎯 Example Flow

### 1. User membuat link dengan custom short link

```
User Input:
- Nama: "Promo Akhir Tahun"
- URL: "https://tokosaya.com/promo"
- Custom Short Link: "promo-2024"
- Deskripsi: "Diskon 50%"

Result:
- Short Link: "promo-2024" (tersimpan di DB)
- Full URL: "viska.app/promo-2024" (ditampilkan di FE)
```

### 2. User membuat link auto-generate

```
User Input:
- Nama: "Kampanye B"
- URL: "https://tokosaya.com/kampanye"
- Custom Short Link: (kosong - auto generate)
- Deskripsi: "..."

Result:
- Short Link: "xYz789" (random, tersimpan di DB)
- Full URL: "viska.app/xYz789" (ditampilkan di FE)
```

### 3. Link dibagikan

```
User share: https://viska.app/promo-2024
```

### 4. Visitor klik link

```
1. System check: link exists & active? ✓
2. Record click:
   - IP: 103.xx.xx.xx
   - Agent: Chrome 120 on Windows
   - Time: 2025-11-11 10:30:00
3. Redirect to: https://tokosaya.com/promo
```

### 5. User melihat statistik

```
Link: promo-2024
Total Clicks: 1,234
Recent Clicks:
- 103.xx.xx.xx | Chrome 120 | 10:30:00
- 202.xx.xx.xx | Safari 17  | 10:28:45
- ...
```

## 🐛 Troubleshooting

### Error: "Gagal menyimpan link"

**Solusi:**

1. Pastikan script `07-rls-policies.sql` sudah dijalankan
2. Verifikasi user sudah login
3. Check console untuk error detail

### Error: "Gagal generate short link unik"

**Solusi:**

- Sangat jarang terjadi (1 dalam 56 miliar)
- Coba lagi, sistem auto-retry 10x

### Link tidak bisa diakses (403)

**Solusi:**

1. Check apakah link `active = true`
2. Verifikasi RLS policies sudah disetup
3. Check di Supabase Dashboard > Table Editor

## 🎯 Next Features

- [ ] Custom short link (user bisa pilih sendiri)
- [ ] QR Code generator untuk short link
- [ ] Analytics dashboard
- [ ] Export statistik ke CSV
- [ ] Link expiration date
- [ ] Password protected links
- [ ] UTM parameters tracking

## 📚 References

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Short URL Best Practices](https://en.wikipedia.org/wiki/URL_shortening)

---

**Author**: ViskaDigital Team  
**Last Updated**: November 11, 2025
