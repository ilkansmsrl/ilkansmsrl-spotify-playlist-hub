'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Playlist, sanatçı veya şarkı ara..."
          className="w-full bg-spotify-light-gray text-white pl-12 pr-4 py-3 rounded-full
            text-base focus:outline-none focus:ring-2 focus:ring-spotify-green
            placeholder:text-gray-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-spotify text-sm py-1.5 px-5"
        >
          Ara
        </button>
      </div>
    </form>
  );
}
