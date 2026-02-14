'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, User, Users, Music, UserPlus } from 'lucide-react';

interface DiscoverUser {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    followers: number;
    following: number;
    savedPlaylists: number;
  };
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchUsers = (q?: string) => {
    setLoading(true);
    const url = q ? `/api/users?q=${encodeURIComponent(q)}&limit=30` : '/api/users?limit=30';
    fetch(url)
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(query);
  };

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-spotify-green" />
          Kişileri Keşfet
        </h1>
        <p className="text-spotify-lighter-gray">
          Müzik zevkini paylaşan insanları bul ve takip et
        </p>
      </div>

      {/* Arama */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="w-full bg-spotify-light-gray text-white pl-12 pr-4 py-3 rounded-full
              focus:outline-none focus:ring-2 focus:ring-spotify-green placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-spotify text-sm py-1.5 px-5"
          >
            Ara
          </button>
        </div>
      </form>

      {/* Kullanıcı Listesi */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-spotify-medium-gray rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-spotify-light-gray" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-spotify-light-gray rounded w-1/2" />
                  <div className="h-3 bg-spotify-light-gray rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-spotify-lighter-gray mx-auto mb-4" />
          <p className="text-spotify-lighter-gray text-lg">
            Henüz kullanıcı bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users
            .filter((u) => u.id !== session?.user?.id)
            .map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="bg-spotify-medium-gray rounded-xl p-6 hover:bg-spotify-light-gray transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || ''}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-transparent group-hover:border-spotify-green transition-colors"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-spotify-light-gray flex items-center justify-center group-hover:bg-spotify-green/20 transition-colors">
                      <User className="w-8 h-8 text-spotify-lighter-gray" />
                    </div>
                  )}

                  {/* Bilgiler */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {user.name || 'Kullanıcı'}
                    </h3>
                    {user.bio && (
                      <p className="text-sm text-spotify-lighter-gray truncate">
                        {user.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-spotify-lighter-gray">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {user._count.followers} takipçi
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {user._count.savedPlaylists} playlist
                      </span>
                    </div>
                  </div>

                  {/* Takip Et ikonu */}
                  <UserPlus className="w-5 h-5 text-spotify-lighter-gray group-hover:text-spotify-green transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
