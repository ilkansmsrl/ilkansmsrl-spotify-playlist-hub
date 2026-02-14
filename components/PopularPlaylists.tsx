'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Music, Heart } from 'lucide-react';

interface PopularPlaylist {
  spotifyId: string;
  name: string;
  imageUrl: string | null;
  ownerName: string | null;
  totalTracks: number;
  spotifyUrl: string | null;
  category: string | null;
  saveCount: number;
}

interface CategoryInfo {
  name: string;
  count: number;
}

export default function PopularPlaylists() {
  const [playlists, setPlaylists] = useState<PopularPlaylist[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = selectedCategory
      ? `/api/popular?category=${encodeURIComponent(selectedCategory)}&limit=12`
      : '/api/popular?limit=12';

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.data || []);
        if (!selectedCategory) {
          setCategories(data.categories || []);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  if (loading && playlists.length === 0) {
    return null; // İlk yüklemede boş ise gösterme
  }

  if (playlists.length === 0 && !loading) {
    return null; // Kayıtlı playlist yoksa bu bölümü gösterme
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-spotify-green" />
          En Çok Kaydedilen Playlistler
        </h2>
      </div>

      {/* Kategori filtreleri */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-spotify-green text-black'
                : 'bg-spotify-light-gray text-white hover:bg-white/20'
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-spotify-green text-black'
                  : 'bg-spotify-light-gray text-white hover:bg-white/20'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {/* Playlist grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist, index) => (
          <Link
            key={playlist.spotifyId}
            href={`/playlist/${playlist.spotifyId}`}
            className="playlist-card bg-spotify-medium-gray rounded-lg p-4 group relative"
          >
            {/* Sıra Numarası */}
            {index < 3 && (
              <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-spotify-green flex items-center justify-center">
                <span className="text-xs font-bold text-black">
                  {index + 1}
                </span>
              </div>
            )}

            <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-spotify-light-gray">
              {playlist.imageUrl ? (
                <img
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center absolute inset-0 fallback-icon ${playlist.imageUrl ? 'hidden' : ''}`}>
                <Music className="w-12 h-12 text-spotify-lighter-gray" />
              </div>
            </div>

            <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
            <p className="text-xs text-spotify-lighter-gray truncate">
              {playlist.ownerName || 'Spotify'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Heart className="w-3 h-3 text-spotify-green fill-spotify-green" />
              <span className="text-xs text-spotify-green font-medium">
                {playlist.saveCount} kayıt
              </span>
            </div>
            {playlist.category && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-spotify-green/10 text-spotify-green text-[10px] rounded-full">
                {playlist.category}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
