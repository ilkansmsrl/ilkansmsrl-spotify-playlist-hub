'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, ExternalLink, Loader2, Music, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import SavePlaylistButton from '@/components/SavePlaylistButton';

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; height: number | null; width: number | null }[];
  };
  external_urls: { spotify: string };
  preview_url: string | null;
}

interface PlaylistDetail {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number | null; width: number | null }[];
  owner: { display_name: string; id: string };
  tracks: { total: number; href: string };
  external_urls: { spotify: string };
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/playlist/${params.id}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (data.success) {
          setPlaylist(data.playlist);
          setTracks(data.tracks || []);
        } else {
          setError(data.error || 'Playlist yüklenemedi');
        }
      } catch {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-spotify-green" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">
          {error || 'Playlist bulunamadı'}
        </h1>
        <Link href="/" className="btn-spotify">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const imageUrl = playlist.images?.[0]?.url;

  return (
    <div className="space-y-8">
      {/* Geri butonu */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-spotify-lighter-gray hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Geri
      </Link>

      {/* Playlist başlığı */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Kapak görseli */}
        <div className="relative w-56 h-56 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 bg-spotify-medium-gray">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={playlist.name}
              fill
              className="object-cover"
              sizes="224px"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-20 h-20 text-spotify-lighter-gray" />
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div className="flex-1 space-y-4">
          <p className="text-sm text-spotify-lighter-gray uppercase tracking-wider">
            Playlist
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">{playlist.name}</h1>
          {playlist.description && (
            <p
              className="text-spotify-lighter-gray"
              dangerouslySetInnerHTML={{
                __html: playlist.description,
              }}
            />
          )}
          <div className="flex items-center gap-4 text-sm text-spotify-lighter-gray">
            <span className="font-semibold text-white">
              {playlist.owner?.display_name}
            </span>
            <span>•</span>
            <span>{playlist.tracks?.total || tracks.length} şarkı</span>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={playlist.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spotify inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Spotify&apos;da Aç
            </a>
            <SavePlaylistButton
              spotifyId={params.id}
              name={playlist.name}
              description={playlist.description}
              imageUrl={imageUrl}
              ownerName={playlist.owner?.display_name}
              totalTracks={playlist.tracks?.total}
              spotifyUrl={playlist.external_urls?.spotify}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Şarkı listesi */}
      {tracks.length > 0 ? (
        <div className="mt-8">
          {/* Tablo başlığı */}
          <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-2 text-xs text-spotify-lighter-gray uppercase tracking-wider border-b border-white/10">
            <span>#</span>
            <span>Başlık</span>
            <span>Albüm</span>
            <span className="flex justify-end">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          {/* Şarkılar */}
          <div className="divide-y divide-white/5">
            {tracks.map((track, index) => (
              <div
                key={track.id || index}
                className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-3 hover:bg-white/5 rounded group items-center"
              >
                <span className="text-sm text-spotify-lighter-gray">
                  {index + 1}
                </span>

                <div className="flex items-center gap-3 min-w-0">
                  {track.album?.images?.[2]?.url ? (
                    <Image
                      src={track.album.images[2].url}
                      alt={track.album.name}
                      width={40}
                      height={40}
                      className="rounded flex-shrink-0"
                      unoptimized
                    />
                  ) : track.album?.images?.[0]?.url ? (
                    <Image
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      width={40}
                      height={40}
                      className="rounded flex-shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-spotify-medium-gray flex items-center justify-center flex-shrink-0">
                      <Music className="w-5 h-5 text-spotify-lighter-gray" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{track.name}</p>
                    <p className="text-xs text-spotify-lighter-gray truncate">
                      {track.artists?.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-spotify-lighter-gray truncate">
                  {track.album?.name}
                </p>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-spotify-lighter-gray">
                    {formatDuration(track.duration_ms)}
                  </span>
                  <a
                    href={track.external_urls?.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-spotify-lighter-gray hover:text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Şarkılar</h2>
          <div className="rounded-xl overflow-hidden">
            <iframe
              style={{ borderRadius: '12px' }}
              src={`https://open.spotify.com/embed/playlist/${params.id}?utm_source=generator&theme=0`}
              width="100%"
              height="552"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
