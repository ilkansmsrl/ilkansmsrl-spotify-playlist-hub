'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Users,
  Music,
  Calendar,
  Edit3,
  MessageCircle,
  UserPlus,
  UserMinus,
  Heart,
  Disc3,
} from 'lucide-react';

interface SpotifyPlaylistItem {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  owner: { display_name: string; id: string };
  tracks: { total: number };
  external_urls: { spotify: string };
  public: boolean;
}

interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  spotifyId: string | null;
  createdAt: string;
  isFollowing: boolean;
  isOwnProfile: boolean;
  _count: {
    followers: number;
    following: number;
    savedPlaylists: number;
  };
  savedPlaylists: {
    id: string;
    spotifyId: string;
    name: string;
    imageUrl: string | null;
    ownerName: string | null;
    totalTracks: number;
    spotifyUrl: string | null;
    category: string | null;
  }[];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [following, setFollowing] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylistItem[]>([]);
  const [spotifyPlaylistsLoading, setSpotifyPlaylistsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'saved' | 'spotify'>('spotify');

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data);
          setBio(data.data.bio || '');
          setFollowing(data.data.isFollowing);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  // Spotify playlistlerini yükle (kendi profilinde veya herkesin görebilmesi için)
  useEffect(() => {
    if (!profile) return;

    // Sadece kendi profilinde Spotify playlistlerini göster (token erişimi gerekli)
    if (profile.isOwnProfile && session?.user) {
      setSpotifyPlaylistsLoading(true);
      fetch(`/api/my-playlists?userId=${params.id}&limit=50`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSpotifyPlaylists(data.data || []);
          }
        })
        .finally(() => setSpotifyPlaylistsLoading(false));
    }
  }, [profile, session, params.id]);

  const handleFollow = async () => {
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: params.id }),
    });
    const data = await res.json();
    if (data.success) {
      setFollowing(data.action === 'followed');
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                ...prev._count,
                followers:
                  prev._count.followers +
                  (data.action === 'followed' ? 1 : -1),
              },
            }
          : prev
      );
    }
  };

  const handleSaveBio = async () => {
    await fetch(`/api/users/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio }),
    });
    setEditingBio(false);
    setProfile((prev) => (prev ? { ...prev, bio } : prev));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı bulunamadı</h1>
        <Link href="/" className="btn-spotify">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profil Başlığı */}
      <div className="bg-gradient-to-b from-spotify-green/20 to-transparent rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.name || ''}
                width={128}
                height={128}
                className="rounded-full border-4 border-spotify-green shadow-lg"
                unoptimized
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-spotify-medium-gray flex items-center justify-center border-4 border-spotify-green">
                <User className="w-16 h-16 text-spotify-lighter-gray" />
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{profile.name || 'Kullanıcı'}</h1>

            {/* Bio */}
            {profile.isOwnProfile && editingBio ? (
              <div className="mt-2 flex gap-2">
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-spotify-light-gray text-white px-3 py-1.5 rounded-lg text-sm flex-1
                    focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Kendinizi tanıtın..."
                  maxLength={160}
                />
                <button onClick={handleSaveBio} className="btn-spotify text-sm py-1 px-4">
                  Kaydet
                </button>
              </div>
            ) : (
              <p className="text-spotify-lighter-gray mt-1 flex items-center justify-center sm:justify-start gap-2">
                {profile.bio || 'Henüz bir bio eklenmemiş'}
                {profile.isOwnProfile && (
                  <button onClick={() => setEditingBio(true)}>
                    <Edit3 className="w-4 h-4 text-spotify-lighter-gray hover:text-white" />
                  </button>
                )}
              </p>
            )}

            {/* İstatistikler */}
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
              <div className="text-center">
                <p className="text-xl font-bold">{profile._count.followers}</p>
                <p className="text-xs text-spotify-lighter-gray">Takipçi</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{profile._count.following}</p>
                <p className="text-xs text-spotify-lighter-gray">Takip</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{profile._count.savedPlaylists}</p>
                <p className="text-xs text-spotify-lighter-gray">Playlist</p>
              </div>
            </div>

            {/* Katılma tarihi */}
            <p className="text-xs text-spotify-lighter-gray mt-3 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
              })}{' '}
              tarihinde katıldı
            </p>

            {/* Aksiyon Butonları */}
            {!profile.isOwnProfile && session?.user && (
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 py-2 px-5 rounded-full font-semibold text-sm transition-colors ${
                    following
                      ? 'bg-spotify-light-gray text-white hover:bg-red-500/20 hover:text-red-400'
                      : 'btn-spotify'
                  }`}
                >
                  {following ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Takipten Çık
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Takip Et
                    </>
                  )}
                </button>
                <Link
                  href={`/messages?with=${profile.id}`}
                  className="flex items-center gap-2 py-2 px-5 rounded-full font-semibold text-sm
                    bg-spotify-light-gray text-white hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Mesaj Gönder
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Sekmeleri */}
      <section>
        {/* Tab butonları */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-2">
          {profile.isOwnProfile && (
            <button
              onClick={() => setActiveTab('spotify')}
              className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'spotify'
                  ? 'text-spotify-green border-spotify-green'
                  : 'text-spotify-lighter-gray border-transparent hover:text-white'
              }`}
            >
              <Disc3 className="w-4 h-4" />
              Spotify Playlistlerim ({spotifyPlaylists.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'saved'
                ? 'text-spotify-green border-spotify-green'
                : 'text-spotify-lighter-gray border-transparent hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            Kaydedilen Playlistler ({profile.savedPlaylists.length})
          </button>
        </div>

        {/* Spotify Playlistlerim Tab */}
        {activeTab === 'spotify' && profile.isOwnProfile && (
          <>
            {spotifyPlaylistsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
              </div>
            ) : spotifyPlaylists.length === 0 ? (
              <div className="bg-spotify-medium-gray rounded-lg p-8 text-center">
                <Disc3 className="w-12 h-12 text-spotify-lighter-gray mx-auto mb-3" />
                <p className="text-spotify-lighter-gray">
                  Spotify hesabınızda playlist bulunamadı.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {spotifyPlaylists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className="playlist-card block bg-spotify-medium-gray rounded-lg p-4 group"
                  >
                    <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-spotify-light-gray">
                      {playlist.images?.[0]?.url ? (
                        <Image
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-12 h-12 text-spotify-lighter-gray" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                    <p className="text-xs text-spotify-lighter-gray truncate">
                      {playlist.owner?.display_name || 'Spotify'}
                    </p>
                    <p className="text-xs text-spotify-lighter-gray mt-1">
                      {playlist.tracks?.total || 0} şarkı
                    </p>
                    {!playlist.public && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded-full">
                        Gizli
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Kaydedilen Playlistler Tab */}
        {activeTab === 'saved' && (
          <>
            {profile.savedPlaylists.length === 0 ? (
          <div className="bg-spotify-medium-gray rounded-lg p-8 text-center">
            <Music className="w-12 h-12 text-spotify-lighter-gray mx-auto mb-3" />
            <p className="text-spotify-lighter-gray">
              Henüz kaydedilen playlist yok.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.savedPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.spotifyId}`}
                className="playlist-card block bg-spotify-medium-gray rounded-lg p-4 group"
              >
                <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-spotify-light-gray">
                  {playlist.imageUrl ? (
                    <Image
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-spotify-lighter-gray" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                <p className="text-xs text-spotify-lighter-gray truncate">
                  {playlist.ownerName || 'Spotify'}
                </p>
                {playlist.category && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full">
                    {playlist.category}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
          </>
        )}
      </section>
    </div>
  );
}
