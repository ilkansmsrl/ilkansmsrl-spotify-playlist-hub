'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Music, Search, MessageCircle, Users, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="bg-spotify-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Music className="w-8 h-8 text-spotify-green group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold hidden sm:inline">
              Playlist Hub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-spotify-lighter-gray hover:text-white transition-colors text-sm sm:text-base"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/categories"
              className="text-spotify-lighter-gray hover:text-white transition-colors text-sm sm:text-base"
            >
              Kategoriler
            </Link>
            <Link
              href="/discover"
              className="text-spotify-lighter-gray hover:text-white transition-colors text-sm sm:text-base"
            >
              <Users className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Keşfet</span>
            </Link>

            {/* Arama */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Playlist ara..."
                  className="bg-spotify-light-gray text-white px-4 py-1.5 rounded-full text-sm
                    focus:outline-none focus:ring-2 focus:ring-spotify-green w-48"
                  autoFocus
                  onBlur={() => {
                    if (!query) setSearchOpen(false);
                  }}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-spotify-lighter-gray hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Auth */}
            {session?.user ? (
              <div className="relative">
                {/* Mesajlar */}
                <Link
                  href="/messages"
                  className="text-spotify-lighter-gray hover:text-white transition-colors mr-3"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>

                {/* Profil menü */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-transparent hover:border-spotify-green transition-colors"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-spotify-light-gray rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-semibold truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-spotify-lighter-gray truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href={`/profile/${session.user.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-spotify-lighter-gray hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profilim
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-spotify-lighter-gray hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Mesajlarım
                    </Link>
                    <Link
                      href="/discover"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-spotify-lighter-gray hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Kişileri Keşfet
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('spotify')}
                className="btn-spotify text-sm py-1.5 px-4"
              >
                Giriş Yap
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
