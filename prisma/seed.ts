import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Test kullanıcıları oluştur
  const user1 = await prisma.user.create({
    data: {
      name: 'Ece Müzik',
      email: 'ece@example.com',
      image: 'https://i.pravatar.cc/150?u=ece',
      bio: '🎶 Müzik tutkunu | Türkçe Pop & Indie | Her gün yeni playlist keşfediyorum',
      spotifyId: 'ece_muzik_test',
      savedPlaylists: {
        create: [
          {
            spotifyId: '1PdITMO3XFJQ9mg5t91hGH',
            name: 'Türkçe Pop Hareketli Şarkılar',
            description: 'En sevilen Türkçe pop hareketli şarkılar',
            imageUrl: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c949d5d21e9febcc2bf8fb677',
            ownerName: 'New Music',
            totalTracks: 290,
            spotifyUrl: 'https://open.spotify.com/playlist/1PdITMO3XFJQ9mg5t91hGH',
            category: 'turkish-pop',
          },
          {
            spotifyId: '3WZaJeRfxz0NtHOXrTaKlI',
            name: 'Türkçe Pop 2000\'ler 2010\'lar',
            description: '2000 ve 2010\'ların en iyi Türkçe pop şarkıları',
            imageUrl: 'https://mosaic.scdn.co/640/ab67616d00001e025ab1f085e70a089cdad530b4ab67616d00001e027d2bb058ca3663135b7716cbab67616d00001e029bb183a98328253425786ebdab67616d00001e02b623964d5c21ee0a64dd7e76',
            ownerName: 'Göksu Tunç',
            totalTracks: 210,
            spotifyUrl: 'https://open.spotify.com/playlist/3WZaJeRfxz0NtHOXrTaKlI',
            category: 'turkish-pop',
          },
          {
            spotifyId: '5KJDMJe9EJ7QRz8FG2MIpI',
            name: 'Best Hits 2026 🔥 Popular Songs',
            description: 'Best Hits 2025/2026 | Top Music Hits',
            imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cc9571da656091290878b1a3b',
            ownerName: 'Hot Vibes',
            totalTracks: 147,
            spotifyUrl: 'https://open.spotify.com/playlist/5KJDMJe9EJ7QRz8FG2MIpI',
            category: 'pop',
          },
          {
            spotifyId: '0vvXsWCC9xrXsKd4FyS8kM',
            name: 'Chill Lofi Beats',
            description: 'Rahatlatıcı lo-fi müzikler, çalışırken dinle',
            imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c3249b35e7970b4e0aeffc658',
            ownerName: 'Lofi Girl',
            totalTracks: 450,
            spotifyUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM',
            category: 'chill',
          },
          {
            spotifyId: '37i9dQZF1DX4JAvHpjipBk',
            name: 'New Music Friday Türkiye',
            description: 'Haftanın yeni çıkan Türkçe şarkıları',
            imageUrl: 'https://i.scdn.co/image/ab67706f000000025f7327d3f2f04123e0a7390a',
            ownerName: 'Spotify',
            totalTracks: 100,
            spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk',
            category: 'turkish-pop',
          },
        ],
      },
      activities: {
        create: [
          { type: 'saved_playlist', targetId: '1PdITMO3XFJQ9mg5t91hGH', metadata: JSON.stringify({ name: 'Türkçe Pop Hareketli Şarkılar' }) },
          { type: 'saved_playlist', targetId: '5KJDMJe9EJ7QRz8FG2MIpI', metadata: JSON.stringify({ name: 'Best Hits 2026' }) },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Ahmet Rock',
      email: 'ahmet@example.com',
      image: 'https://i.pravatar.cc/150?u=ahmet',
      bio: '🎸 Rock & Metal hayranı | Gitar çalıyorum | Indie keşifçisi',
      spotifyId: 'ahmet_rock_test',
      savedPlaylists: {
        create: [
          {
            spotifyId: '5KJDMJe9EJ7QRz8FG2MIpI',
            name: 'Best Hits 2026 🔥 Popular Songs',
            description: 'Best Hits 2025/2026 | Top Music Hits',
            imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cc9571da656091290878b1a3b',
            ownerName: 'Hot Vibes',
            totalTracks: 147,
            spotifyUrl: 'https://open.spotify.com/playlist/5KJDMJe9EJ7QRz8FG2MIpI',
            category: 'pop',
          },
          {
            spotifyId: '1PdITMO3XFJQ9mg5t91hGH',
            name: 'Türkçe Pop Hareketli Şarkılar',
            description: 'En sevilen Türkçe pop hareketli şarkılar',
            imageUrl: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c949d5d21e9febcc2bf8fb677',
            ownerName: 'New Music',
            totalTracks: 290,
            spotifyUrl: 'https://open.spotify.com/playlist/1PdITMO3XFJQ9mg5t91hGH',
            category: 'turkish-pop',
          },
          {
            spotifyId: '0vvXsWCC9xrXsKd4FyS8kM',
            name: 'Chill Lofi Beats',
            description: 'Rahatlatıcı lo-fi müzikler',
            imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c3249b35e7970b4e0aeffc658',
            ownerName: 'Lofi Girl',
            totalTracks: 450,
            spotifyUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM',
            category: 'chill',
          },
        ],
      },
      activities: {
        create: [
          { type: 'saved_playlist', targetId: '5KJDMJe9EJ7QRz8FG2MIpI', metadata: JSON.stringify({ name: 'Best Hits 2026' }) },
        ],
      },
    },
  });

  // Birbirlerini takip etsinler
  await prisma.follow.create({
    data: { followerId: user1.id, followingId: user2.id },
  });
  await prisma.follow.create({
    data: { followerId: user2.id, followingId: user1.id },
  });

  // Activity: follow
  await prisma.activity.create({
    data: { userId: user1.id, type: 'followed_user', targetId: user2.id, metadata: JSON.stringify({ name: 'Ahmet Rock' }) },
  });
  await prisma.activity.create({
    data: { userId: user2.id, type: 'followed_user', targetId: user1.id, metadata: JSON.stringify({ name: 'Ece Müzik' }) },
  });

  // Birkaç mesaj
  await prisma.message.createMany({
    data: [
      { senderId: user1.id, receiverId: user2.id, content: 'Merhaba! O rock playlistin çok iyi 🎸' },
      { senderId: user2.id, receiverId: user1.id, content: 'Teşekkürler! Senin Türkçe pop listenzi de beğendim 👍' },
      { senderId: user1.id, receiverId: user2.id, content: 'Yeni bir indie playlist paylaşacağım yakında, takipte kal!' },
    ],
  });

  console.log('✅ Seed tamamlandı!');
  console.log(`   Kullanıcı 1: ${user1.name} (ID: ${user1.id})`);
  console.log(`   Kullanıcı 2: ${user2.name} (ID: ${user2.id})`);
  console.log('   - 5 + 3 kayıtlı playlist');
  console.log('   - Karşılıklı takip');
  console.log('   - 3 mesaj');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
