import Link from 'next/link';
import { MUSIC_GENRES } from '@/lib/spotify';

const categoryColors = [
  'from-purple-600 to-blue-500',
  'from-green-500 to-teal-500',
  'from-pink-500 to-red-500',
  'from-yellow-500 to-orange-500',
  'from-indigo-500 to-purple-500',
  'from-red-500 to-pink-500',
  'from-teal-500 to-cyan-500',
  'from-orange-500 to-yellow-500',
  'from-blue-500 to-indigo-500',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-red-500',
  'from-emerald-500 to-green-500',
];

const categoryEmojis: Record<string, string> = {
  'pop': '🎵',
  'hiphop': '🎤',
  'rock': '🎸',
  'rnb': '🎶',
  'electronic': '🎧',
  'jazz': '🎷',
  'classical': '🎻',
  'turkish-pop': '🇹🇷',
  'turkish-rap': '🎙️',
  'arabesk': '🪕',
  'latin': '💃',
  'indie': '🌿',
  'metal': '🤘',
  'chill': '😌',
  'workout': '💪',
  'party': '🎉',
  'sleep': '😴',
  'focus': '🧠',
  'romance': '❤️',
  'kpop': '🇰🇷',
};

export default function CategoriesPage() {
  const categories = MUSIC_GENRES;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Tüm Kategoriler</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className={`relative rounded-lg overflow-hidden aspect-square group bg-gradient-to-br ${
              categoryColors[index % categoryColors.length]
            } flex items-center justify-center hover:scale-105 transition-all duration-300`}
          >
            <div className="text-center">
              <span className="text-5xl mb-3 block">
                {categoryEmojis[category.id] || '🎵'}
              </span>
              <h3 className="font-bold text-white text-lg drop-shadow-lg">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
