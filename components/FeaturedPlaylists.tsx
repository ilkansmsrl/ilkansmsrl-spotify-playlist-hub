import PlaylistCard from './PlaylistCard';
import type { SpotifyPlaylist } from '@/lib/spotify';

async function getFeaturedPlaylists(): Promise<SpotifyPlaylist[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3000';
    const res = await fetch(`${baseUrl}/api/playlists?limit=12`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function FeaturedPlaylists() {
  const playlists = await getFeaturedPlaylists();

  if (playlists.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Öne Çıkan Playlistler</h2>
        <div className="bg-spotify-medium-gray rounded-lg p-8 text-center">
          <p className="text-spotify-lighter-gray">
            Playlistler yüklenemedi. Lütfen Spotify API anahtarlarınızı kontrol edin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Öne Çıkan Playlistler</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </section>
  );
}
