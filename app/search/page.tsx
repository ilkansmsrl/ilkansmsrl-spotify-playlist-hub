'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import PlaylistCard from '@/components/PlaylistCard';
import SearchBar from '@/components/SearchBar';
import type { SpotifyPlaylist } from '@/lib/spotify';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.data || []);
      })
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Arama Sonuçları</h1>
        <SearchBar />
      </div>

      {query && (
        <p className="text-spotify-lighter-gray">
          &quot;<span className="text-white font-semibold">{query}</span>&quot;
          için sonuçlar
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-spotify-medium-gray rounded-lg p-4 animate-pulse"
            >
              <div className="aspect-square bg-spotify-light-gray rounded-md mb-4" />
              <div className="h-4 bg-spotify-light-gray rounded w-3/4 mb-2" />
              <div className="h-3 bg-spotify-light-gray rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-spotify-lighter-gray text-lg">
            Sonuç bulunamadı. Farklı bir arama deneyin.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-spotify-lighter-gray">Yükleniyor...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
