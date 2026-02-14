// Spotify Web API Helper
// Client Credentials Flow kullanarak token alır ve API istekleri yapar

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  owner: {
    display_name: string;
    id: string;
  };
  tracks: {
    total: number;
    href: string;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyCategory {
  id: string;
  name: string;
  icons: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

// Sabit kategori listesi (Spotify Browse API kullanımdan kaldırıldığı için)
export const MUSIC_GENRES: SpotifyCategory[] = [
  { id: 'pop', name: 'Pop', icons: [{ url: '', height: null, width: null }] },
  { id: 'hiphop', name: 'Hip Hop', icons: [{ url: '', height: null, width: null }] },
  { id: 'rock', name: 'Rock', icons: [{ url: '', height: null, width: null }] },
  { id: 'rnb', name: 'R&B', icons: [{ url: '', height: null, width: null }] },
  { id: 'electronic', name: 'Elektronik', icons: [{ url: '', height: null, width: null }] },
  { id: 'jazz', name: 'Jazz', icons: [{ url: '', height: null, width: null }] },
  { id: 'classical', name: 'Klasik Müzik', icons: [{ url: '', height: null, width: null }] },
  { id: 'turkish-pop', name: 'Türkçe Pop', icons: [{ url: '', height: null, width: null }] },
  { id: 'turkish-rap', name: 'Türkçe Rap', icons: [{ url: '', height: null, width: null }] },
  { id: 'arabesk', name: 'Arabesk', icons: [{ url: '', height: null, width: null }] },
  { id: 'latin', name: 'Latin', icons: [{ url: '', height: null, width: null }] },
  { id: 'indie', name: 'Indie', icons: [{ url: '', height: null, width: null }] },
  { id: 'metal', name: 'Metal', icons: [{ url: '', height: null, width: null }] },
  { id: 'chill', name: 'Chill', icons: [{ url: '', height: null, width: null }] },
  { id: 'workout', name: 'Workout', icons: [{ url: '', height: null, width: null }] },
  { id: 'party', name: 'Parti', icons: [{ url: '', height: null, width: null }] },
  { id: 'sleep', name: 'Uyku', icons: [{ url: '', height: null, width: null }] },
  { id: 'focus', name: 'Odaklanma', icons: [{ url: '', height: null, width: null }] },
  { id: 'romance', name: 'Romantik', icons: [{ url: '', height: null, width: null }] },
  { id: 'kpop', name: 'K-Pop', icons: [{ url: '', height: null, width: null }] },
];

// Kategori ID -> Arama sorgusu eşlemesi
const GENRE_SEARCH_QUERIES: Record<string, string> = {
  'pop': 'pop hits playlist',
  'hiphop': 'hip hop rap playlist',
  'rock': 'rock playlist',
  'rnb': 'r&b soul playlist',
  'electronic': 'electronic dance EDM playlist',
  'jazz': 'jazz playlist',
  'classical': 'classical music playlist',
  'turkish-pop': 'türkçe pop playlist',
  'turkish-rap': 'türkçe rap playlist',
  'arabesk': 'arabesk türkü playlist',
  'latin': 'latin reggaeton playlist',
  'indie': 'indie alternative playlist',
  'metal': 'metal heavy playlist',
  'chill': 'chill lofi relax playlist',
  'workout': 'workout gym motivation playlist',
  'party': 'party dance hits playlist',
  'sleep': 'sleep calm ambient playlist',
  'focus': 'focus study concentration playlist',
  'romance': 'romantic love songs playlist',
  'kpop': 'k-pop korean playlist',
};

class SpotifyAPI {
  private clientId: string;
  private clientSecret: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        'SPOTIFY_CLIENT_ID ve SPOTIFY_CLIENT_SECRET ortam değişkenleri gerekli!'
      );
    }
  }

  private async getToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
            'base64'
          ),
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify token alınamadı: ${response.statusText}`);
    }

    const data: SpotifyToken = await response.json();
    this.token = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return this.token;
  }

  private async fetchAPI<T>(endpoint: string): Promise<T> {
    const token = await this.getToken();

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API hatası: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Spotify API'den gelen veriyi normalize et (items -> tracks mapping)
  private normalizePlaylist(p: any): SpotifyPlaylist {
    // Spotify API bazen 'tracks' yerine 'items' döndürüyor
    const tracksData = p.tracks || p.items;
    return {
      ...p,
      tracks: tracksData
        ? { total: tracksData.total || 0, href: tracksData.href || '' }
        : { total: 0, href: '' },
    };
  }

  // Sabit kategori listesini döndür
  getCategories(limit: number = 20): SpotifyCategory[] {
    return MUSIC_GENRES.slice(0, limit);
  }

  // Kategori ID'sine göre search sorgusu ile playlist getir
  async getCategoryPlaylists(
    categoryId: string,
    limit: number = 20
  ): Promise<SpotifyPlaylist[]> {
    const query = GENRE_SEARCH_QUERIES[categoryId] || `${categoryId} playlist`;
    return this.searchPlaylists(query, limit);
  }

  // Popüler/trend playlistler (search ile)
  async getFeaturedPlaylists(
    limit: number = 20
  ): Promise<SpotifyPlaylist[]> {
    // Birden fazla popüler arama sorgusu ile en iyi sonuçları getir
    const queries = ['top hits 2026', 'popular music playlist', 'trending playlist türkiye'];
    const results: SpotifyPlaylist[] = [];
    const seenIds = new Set<string>();

    for (const query of queries) {
      if (results.length >= limit) break;
      try {
        const playlists = await this.searchPlaylists(query, Math.ceil(limit / queries.length));
        for (const p of playlists) {
          if (!seenIds.has(p.id) && results.length < limit) {
            seenIds.add(p.id);
            results.push(p);
          }
        }
      } catch {
        // Bir sorgu başarısız olursa diğerlerine devam et
      }
    }

    return results;
  }

  async searchPlaylists(
    query: string,
    limit: number = 20
  ): Promise<SpotifyPlaylist[]> {
    const data = await this.fetchAPI<{
      playlists: { items: any[] };
    }>(
      `/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}&market=TR`
    );

    return (data.playlists.items || []).filter(Boolean).map(this.normalizePlaylist);
  }

  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    const data = await this.fetchAPI<any>(`/playlists/${playlistId}?market=TR`);
    return this.normalizePlaylist(data);
  }

  async getPlaylistTracks(
    playlistId: string,
    limit: number = 50
  ): Promise<SpotifyTrack[]> {
    const data = await this.fetchAPI<{
      items: { track: SpotifyTrack }[];
    }>(`/playlists/${playlistId}/tracks?limit=${limit}&market=TR`);

    return data.items.map((item) => item.track).filter(Boolean);
  }
}

export const spotifyAPI = new SpotifyAPI();
