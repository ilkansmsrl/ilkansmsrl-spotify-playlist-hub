# Spotify Playlist Hub 🎵

Spotify playlistlerini keşfetmek, kaydetmek, insanlarla tanışmak ve müzik zevkini paylaşmak için geliştirilmiş sosyal bir web platformu.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![Spotify](https://img.shields.io/badge/Spotify_API-green?logo=spotify)

---

## Özellikler

### 🔍 Keşif & Arama
- **Playlist Arama** — Spotify'daki milyonlarca playlist arasında arama yapın
- **Kategori Tarama** — 20 müzik türüne göre playlistleri keşfedin (Pop, Rock, Hip-Hop, Jazz, Türkçe Pop, vb.)
- **Öne Çıkan Playlistler** — Editörlerin seçtiği playlistleri görüntüleyin
- **En Çok Kaydedilen** — Toplulukta en popüler playlistleri türe göre filtreleyin

### 🎶 Playlist Detayları
- **Şarkı Listesi** — Kendi playlistlerinizde tam şarkı listesi (OAuth ile)
- **Spotify Embed Player** — API erişimi olmayan playlistlerde gömülü oynatıcı ile 30 saniyelik önizleme
- **Playlist Kaydetme** — Beğendiğiniz playlistleri profilinize kaydedin

### 👥 Sosyal Özellikler
- **Kullanıcı Profilleri** — Spotify hesabınızla giriş yapın, biyografi ekleyin
- **Takip Sistemi** — Diğer müzik severları takip edin
- **Mesajlaşma** — Kullanıcılar arası özel mesaj gönderin
- **Keşfet Sayfası** — Platformdaki tüm kullanıcıları görüntüleyin
- **Aktivite Takibi** — Kayıt ve takip aktivitelerini izleyin

### 🎨 Tasarım
- Spotify'ın karanlık temasına uyumlu modern arayüz
- Tamamen responsive (mobil, tablet, masaüstü)
- Kırık görsellerde otomatik fallback ikonu

---

## Teknolojiler

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| **Next.js** | 14 | App Router, SSR, API Routes |
| **TypeScript** | 5.5 | Tip güvenliği |
| **Tailwind CSS** | 3.4 | Styling |
| **Prisma** | 5.22 | ORM (SQLite) |
| **NextAuth.js** | 4.24 | Spotify OAuth kimlik doğrulama |
| **Lucide React** | 0.460 | İkon kütüphanesi |
| **Spotify Web API** | — | Client Credentials + OAuth |

---

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Spotify Developer hesabı

### 1. Projeyi klonlayın

```bash
git clone https://github.com/ilkansmsrl/spotify-playlist-hub.git
cd spotify-playlist-hub
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Spotify API Anahtarlarını Alın

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) adresine gidin
2. Yeni bir uygulama oluşturun
3. **Redirect URI** olarak `http://localhost:3000/api/auth/callback/spotify` ekleyin
4. Client ID ve Client Secret değerlerini kopyalayın

### 4. Ortam Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve doldurun:

```env
# Spotify API
SPOTIFY_CLIENT_ID=sizin_client_id
SPOTIFY_CLIENT_SECRET=sizin_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rastgele_guclu_bir_secret

# Veritabanı
DATABASE_URL="file:./dev.db"

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Veritabanını oluşturun

```bash
npx prisma db push
```

### 6. (Opsiyonel) Test verisi ekleyin

```bash
npx prisma db seed
```

### 7. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## Proje Yapısı

```
spotify-playlist-hub/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Header, AuthProvider)
│   ├── page.tsx                  # Ana sayfa
│   ├── globals.css               # Global stiller
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth endpoint
│   │   ├── categories/           # Müzik kategorileri
│   │   ├── follow/               # Takip et / bırak
│   │   ├── messages/             # Mesaj gönder / al
│   │   ├── my-playlists/         # Kullanıcının Spotify playlistleri
│   │   ├── playlist/[id]/        # Playlist detay + şarkılar
│   │   ├── playlists/            # Öne çıkan playlistler
│   │   ├── popular/              # En çok kaydedilen playlistler
│   │   ├── save-playlist/        # Playlist kaydet / kaldır
│   │   ├── search/               # Playlist arama
│   │   └── users/                # Kullanıcı listesi + profil
│   ├── auth/signin/              # Giriş sayfası
│   ├── categories/               # Kategoriler sayfası
│   ├── category/[id]/            # Kategori detay
│   ├── discover/                 # Keşfet (kullanıcılar)
│   ├── messages/                 # Mesajlar sayfası
│   ├── playlist/[id]/            # Playlist detay sayfası
│   ├── profile/[id]/             # Kullanıcı profili
│   └── search/                   # Arama sonuçları
│
├── components/                   # React bileşenleri
│   ├── AuthProvider.tsx          # NextAuth session provider
│   ├── CategorySection.tsx       # Kategori grid
│   ├── CommunityBanner.tsx       # Topluluk tanıtım banner'ı
│   ├── FeaturedPlaylists.tsx     # Öne çıkan playlist grid
│   ├── Header.tsx                # Navigasyon çubuğu
│   ├── PlaylistCard.tsx          # Playlist kartı
│   ├── PopularPlaylists.tsx      # Popüler playlistler (kategori filtreli)
│   ├── SavePlaylistButton.tsx    # Kaydet/kaldır butonu
│   └── SearchBar.tsx             # Arama çubuğu
│
├── lib/                          # Yardımcı modüller
│   ├── auth.ts                   # NextAuth yapılandırması
│   ├── prisma.ts                 # Prisma client singleton
│   ├── spotify.ts                # Spotify API (Client Credentials)
│   └── spotify-token.ts          # OAuth token yönetimi
│
├── prisma/
│   ├── schema.prisma             # Veritabanı şeması
│   ├── seed.ts                   # Test verisi
│   └── migrations/               # Migration dosyaları
│
├── types/
│   └── next-auth.d.ts            # NextAuth tip genişletmeleri
│
├── .env.example                  # Örnek ortam değişkenleri
├── next.config.js                # Next.js yapılandırması
├── tailwind.config.js            # Tailwind CSS yapılandırması
├── tsconfig.json                 # TypeScript yapılandırması
└── package.json
```

---

## Veritabanı Şeması

```
User ──────┬── Account (Spotify OAuth)
           ├── Session
           ├── Follow (takipçi/takip edilen)
           ├── Message (gönderen/alıcı)
           ├── SavedPlaylist (kaydedilen playlistler)
           └── Activity (aktivite geçmişi)
```

**Modeller:** User, Account, Session, VerificationToken, Follow, Message, SavedPlaylist, Activity

---

## API Endpoints

| Yöntem | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/search?q=...` | Playlist arama |
| GET | `/api/playlists?limit=...` | Öne çıkan playlistler |
| GET | `/api/categories` | Müzik kategorileri |
| GET | `/api/playlist/:id` | Playlist detay + şarkılar |
| GET | `/api/my-playlists` | Kullanıcının kendi Spotify playlistleri |
| GET | `/api/popular?category=...&limit=...` | En çok kaydedilen playlistler |
| POST/GET | `/api/save-playlist` | Playlist kaydet/kaldır/durum sorgula |
| POST/DELETE | `/api/follow` | Takip et/bırak |
| GET/POST | `/api/messages` | Mesaj listesi/gönder |
| GET | `/api/users` | Kullanıcı listesi |
| GET/PUT | `/api/users/:id` | Kullanıcı profili |

---

## Spotify API Notları

- **Client Credentials**: Arama, kategoriler, öne çıkan playlistler için kullanılır. Giriş gerektirmez.
- **OAuth (User Token)**: Kullanıcının kendi playlistlerindeki şarkıları görmek için kullanılır.
- **Spotify Embed**: Diğer kullanıcıların playlist şarkıları, Spotify Development Mode kısıtlaması nedeniyle API ile alınamaz. Bu durumda Spotify'ın gömülü oynatıcısı (iframe embed) kullanılır — API quota gerektirmez ve 30 saniyelik önizleme sunar.
- **Development Mode Kısıtı**: Spotify API Development modunda sadece kendi hesabınızın playlist şarkılarına erişebilirsiniz. Diğer kullanıcıların şarkılarına erişim için Extended Quota Mode gereklidir (250k+ MAU, kayıtlı şirket).

---

## Deployment

```bash
npm run build
npm start
```

### Vercel ile Deploy

1. GitHub reposunu Vercel'e bağlayın
2. Ortam değişkenlerini Vercel dashboard'undan ekleyin
3. Build komutu: `npx prisma generate && next build`
4. Çıktı dizini: `.next`

> **Not:** Production'da SQLite yerine PostgreSQL veya MySQL kullanmanız önerilir. `prisma/schema.prisma` dosyasındaki `provider`'ı güncelleyin.

---

## Lisans

MIT