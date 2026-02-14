import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// En çok kaydedilen playlistler (türe göre)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Adım 1: Kategori filtreleme varsa, o kategoriye sahip spotifyId'leri bul
    let filteredIds: string[] | null = null;
    if (category) {
      const idsWithCategory = await prisma.savedPlaylist.findMany({
        where: { category },
        select: { spotifyId: true },
        distinct: ['spotifyId'],
      });
      filteredIds = idsWithCategory.map((r: { spotifyId: string }) => r.spotifyId);
      if (filteredIds.length === 0) {
        return NextResponse.json({ success: true, data: [], categories: [] });
      }
    }

    // Adım 2: Sadece spotifyId'ye göre grupla (TÜM kayıtları say)
    const counts = await prisma.savedPlaylist.groupBy({
      by: ['spotifyId'],
      where: filteredIds ? { spotifyId: { in: filteredIds } } : {},
      _count: { spotifyId: true },
      orderBy: { _count: { spotifyId: 'desc' } },
      take: limit,
    });

    // Adım 3: Her spotifyId için detay bilgilerini al
    const spotifyIds = counts.map((c: { spotifyId: string }) => c.spotifyId);
    const allRecords = await prisma.savedPlaylist.findMany({
      where: { spotifyId: { in: spotifyIds } },
      orderBy: { createdAt: 'desc' },
    });

    // Adım 4: Her playlist için en iyi temsili kaydı seç
    const result = counts.map((c: { spotifyId: string; _count: { spotifyId: number } }) => {
      const records = allRecords.filter((r: any) => r.spotifyId === c.spotifyId);

      // Görsel ve kategorisi olan kaydı tercih et
      const best =
        records.find((r: any) => r.category && r.imageUrl) ||
        records.find((r: any) => r.imageUrl) ||
        records.find((r: any) => r.category) ||
        records[0];

      // En çok kullanılan kategoriyi bul
      const catCounts: Record<string, number> = {};
      records.forEach((r: any) => {
        if (r.category) catCounts[r.category] = (catCounts[r.category] || 0) + 1;
      });
      const topCategory =
        Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      return {
        spotifyId: c.spotifyId,
        name: best?.name || '',
        imageUrl: best?.imageUrl,
        ownerName: best?.ownerName,
        totalTracks: best?.totalTracks || 0,
        spotifyUrl: best?.spotifyUrl,
        category: topCategory,
        saveCount: c._count.spotifyId,
      };
    });

    // Mevcut kategorileri getir (benzersiz playlist sayısına göre)
    const allCategoryRecords = await prisma.savedPlaylist.findMany({
      where: { category: { not: null } },
      select: { spotifyId: true, category: true },
      distinct: ['spotifyId', 'category'],
    });
    const catMap: Record<string, Set<string>> = {};
    allCategoryRecords.forEach((r: any) => {
      if (r.category) {
        if (!catMap[r.category]) catMap[r.category] = new Set();
        catMap[r.category].add(r.spotifyId);
      }
    });
    const categories = Object.entries(catMap)
      .map(([name, ids]) => ({ name, count: ids.size }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: result,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
