'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Users, MessageCircle, Heart, UserPlus } from 'lucide-react';

export default function CommunityBanner() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <section className="bg-gradient-to-r from-spotify-green/10 via-spotify-medium-gray to-purple-500/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Hoş geldin, {session.user.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-spotify-lighter-gray">
              Müzik zevkini paylaş, yeni insanlarla tanış ve en sevdiğin playlistleri kaydet.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/discover"
              className="flex items-center gap-2 bg-spotify-green text-black font-semibold py-2.5 px-5 rounded-full hover:bg-spotify-green-dark transition-colors"
            >
              <Users className="w-4 h-4" />
              Keşfet
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-2 bg-spotify-light-gray text-white font-semibold py-2.5 px-5 rounded-full hover:bg-white/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Mesajlar
            </Link>
            <Link
              href={`/profile/${session.user.id}`}
              className="flex items-center gap-2 bg-spotify-light-gray text-white font-semibold py-2.5 px-5 rounded-full hover:bg-white/20 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Profilim
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-spotify-green/20 via-spotify-medium-gray to-purple-500/20 rounded-2xl p-8 text-center">
      <h2 className="text-2xl font-bold mb-3">
        🎵 Topluluğa Katıl
      </h2>
      <p className="text-spotify-lighter-gray mb-6 max-w-lg mx-auto">
        Spotify hesabınla giriş yap, playlistlerini kaydet, insanlarla tanış
        ve müzik zevkini paylaş!
      </p>
      <div className="flex items-center justify-center gap-8 mb-6 text-sm text-spotify-lighter-gray">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-spotify-green" />
          <span>Playlist kaydet</span>
        </div>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-spotify-green" />
          <span>İnsanları takip et</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-spotify-green" />
          <span>Mesajlaş</span>
        </div>
      </div>
      <button
        onClick={() => signIn('spotify')}
        className="bg-spotify-green text-black font-bold py-3 px-8 rounded-full hover:bg-spotify-green-dark transition-colors text-lg"
      >
        Spotify ile Giriş Yap
      </button>
    </section>
  );
}
