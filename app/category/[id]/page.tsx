import PlaylistCard from '@/components/PlaylistCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { SpotifyPlaylist } from '@/lib/spotify';
import { MUSIC_GENRES } from '@/lib/spotify';

interface CategoryPageProps {
  params: { id: string };
}

async function getCategoryPlaylists(
  categoryId: string
): Promise<{ playlists: SpotifyPlaylist[]; categoryName: string }> {
  try {
    // Kategori adını sabit listeden bul
    const genre = MUSIC_GENRES.find((g) => g.id === categoryId);
    const categoryName = genre?.name || categoryId.replace(/[-_]/g, ' ');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3000';
    const res = await fetch(
      `${baseUrl}/api/playlists?category=${categoryId}&limit=30`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return { playlists: [], categoryName };

    const data = await res.json();
    return {
      playlists: data.data || [],
      categoryName,
    };
  } catch {
    const genre = MUSIC_GENRES.find((g) => g.id === categoryId);
    return { playlists: [], categoryName: genre?.name || categoryId };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { playlists, categoryName } = await getCategoryPlaylists(params.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className="text-spotify-lighter-gray hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold capitalize">{categoryName}</h1>
      </div>

      {playlists.length === 0 ? (
        <div className="bg-spotify-medium-gray rounded-lg p-8 text-center">
          <p className="text-spotify-lighter-gray">
            Bu kategoride playlist bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
