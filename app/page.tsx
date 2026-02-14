import CategorySection from '@/components/CategorySection';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import SearchBar from '@/components/SearchBar';
import PopularPlaylists from '@/components/PopularPlaylists';
import CommunityBanner from '@/components/CommunityBanner';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Bölümü */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-spotify-green">Spotify</span> Playlist Hub
        </h1>
        <p className="text-spotify-lighter-gray text-lg mb-8 max-w-2xl mx-auto">
          En popüler playlistleri keşfet, insanlarla tanış ve müzik
          zevkini paylaş.
        </p>
        <SearchBar />
      </section>

      {/* Topluluk Tanıtımı */}
      <CommunityBanner />

      {/* En Çok Kaydedilen Playlistler (türe göre) */}
      <PopularPlaylists />

      {/* Öne Çıkan Playlistler */}
      <FeaturedPlaylists />

      {/* Kategoriler */}
      <CategorySection />
    </div>
  );
}
