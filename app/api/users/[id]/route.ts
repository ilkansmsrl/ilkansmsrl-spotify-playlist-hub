import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Kullanıcı profilini getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        spotifyId: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            savedPlaylists: true,
          },
        },
        savedPlaylists: {
          orderBy: { createdAt: 'desc' },
          take: 12,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Takip durumu
    let isFollowing = false;
    if (session?.user?.id && session.user.id !== params.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: params.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        isFollowing,
        isOwnProfile: session?.user?.id === params.id,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Profil güncelle
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz' },
        { status: 401 }
      );
    }

    const { bio, name } = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { bio, name },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
