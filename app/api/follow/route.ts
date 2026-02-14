import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Takip et / Takipten çık
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { targetUserId } = await request.json();

    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Kendinizi takip edemezsiniz' },
        { status: 400 }
      );
    }

    // Zaten takip ediyor mu kontrol et
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Takipten çık
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });

      return NextResponse.json({
        success: true,
        action: 'unfollowed',
        message: 'Takipten çıkıldı',
      });
    } else {
      // Takip et
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      });

      // Aktivite kaydet
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'followed_user',
          targetId: targetUserId,
        },
      });

      return NextResponse.json({
        success: true,
        action: 'followed',
        message: 'Takip edildi',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
