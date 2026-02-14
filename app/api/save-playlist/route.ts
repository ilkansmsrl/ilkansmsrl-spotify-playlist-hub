import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Playlist kaydet
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { spotifyId, name, description, imageUrl, ownerName, totalTracks, spotifyUrl, category } =
      await request.json();

    // Zaten kayıtlı mı kontrol et
    const existing = await prisma.savedPlaylist.findUnique({
      where: {
        userId_spotifyId: {
          userId: session.user.id,
          spotifyId,
        },
      },
    });

    if (existing) {
      // Kaydı kaldır
      await prisma.savedPlaylist.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Playlist kaldırıldı',
      });
    } else {
      // Kategori verilmediyse, aynı playlist'in mevcut kayıtlarından al
      let resolvedCategory = category || null;
      if (!resolvedCategory) {
        const existingRecord = await prisma.savedPlaylist.findFirst({
          where: { spotifyId, category: { not: null } },
          select: { category: true },
        });
        resolvedCategory = existingRecord?.category || null;
      }

      // Kaydet
      await prisma.savedPlaylist.create({
        data: {
          userId: session.user.id,
          spotifyId,
          name,
          description,
          imageUrl,
          ownerName,
          totalTracks: totalTracks || 0,
          spotifyUrl,
          category: resolvedCategory,
        },
      });

      // Aktivite kaydet
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'saved_playlist',
          targetId: spotifyId,
          metadata: JSON.stringify({ name, imageUrl }),
        },
      });

      return NextResponse.json({
        success: true,
        action: 'saved',
        message: 'Playlist kaydedildi',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Kayıt durumu kontrol
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, saved: false });
    }

    const { searchParams } = new URL(request.url);
    const spotifyId = searchParams.get('spotifyId');

    if (!spotifyId) {
      return NextResponse.json(
        { success: false, error: 'spotifyId gerekli' },
        { status: 400 }
      );
    }

    const existing = await prisma.savedPlaylist.findUnique({
      where: {
        userId_spotifyId: {
          userId: session.user.id,
          spotifyId,
        },
      },
    });

    return NextResponse.json({ success: true, saved: !!existing });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
