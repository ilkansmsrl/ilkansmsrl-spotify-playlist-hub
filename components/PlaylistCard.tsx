'use client';

import Link from 'next/link';
import { Music } from 'lucide-react';
import type { SpotifyPlaylist } from '@/lib/spotify';
import SavePlaylistButton from './SavePlaylistButton';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  category?: string;
}

export default function PlaylistCard({ playlist, category }: PlaylistCardProps) {
  const imageUrl = playlist.images?.[0]?.url;

  return (
    <div className="playlist-card block bg-spotify-medium-gray rounded-lg p-4 group relative">
      <Link href={`/playlist/${playlist.id}`}>
        {/* Kapak görseli */}
        <div className="relative aspect-square rounded-md overflow-hidden mb-4 bg-spotify-light-gray">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.querySelector('.fallback-icon')?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center absolute inset-0 fallback-icon ${imageUrl ? 'hidden' : ''}`}>
            <Music className="w-16 h-16 text-spotify-lighter-gray" />
          </div>
        </div>

        {/* Bilgiler */}
        <h3 className="font-semibold text-white truncate mb-1">
          {playlist.name}
        </h3>
        <p className="text-sm text-spotify-lighter-gray truncate">
          {playlist.description
            ? playlist.description.replace(/<[^>]*>/g, '')
            : `${playlist.owner?.display_name || 'Spotify'} tarafından`}
        </p>
        <p className="text-xs text-spotify-lighter-gray mt-1">
          {playlist.tracks?.total || 0} şarkı
        </p>
      </Link>

      {/* Kaydet Butonu */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <SavePlaylistButton
          spotifyId={playlist.id}
          name={playlist.name}
          description={playlist.description}
          imageUrl={imageUrl}
          ownerName={playlist.owner?.display_name}
          totalTracks={playlist.tracks?.total}
          spotifyUrl={playlist.external_urls?.spotify}
          category={category}
          size="sm"
        />
      </div>
    </div>
  );
}
