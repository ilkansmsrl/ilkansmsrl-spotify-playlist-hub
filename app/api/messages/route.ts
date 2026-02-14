import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mesajları getir
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const withUserId = searchParams.get('with');

    if (withUserId) {
      // Belirli kullanıcıyla olan mesajlar
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: withUserId },
            { senderId: withUserId, receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
        },
      });

      // Okunmamış mesajları okundu olarak işaretle
      await prisma.message.updateMany({
        where: {
          senderId: withUserId,
          receiverId: session.user.id,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json({ success: true, data: messages });
    } else {
      // Sohbet listesi — son mesajları göster
      const conversations = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
        },
      });

      // Kullanıcı bazında gruplama - son mesajı al
      const conversationMap = new Map<string, any>();
      for (const msg of conversations) {
        const otherId =
          msg.senderId === session.user.id ? msg.receiverId : msg.senderId;
        if (!conversationMap.has(otherId)) {
          const otherUser =
            msg.senderId === session.user.id ? msg.receiver : msg.sender;
          const unreadCount = await prisma.message.count({
            where: {
              senderId: otherId,
              receiverId: session.user.id,
              read: false,
            },
          });
          conversationMap.set(otherId, {
            user: otherUser,
            lastMessage: msg,
            unreadCount,
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: Array.from(conversationMap.values()),
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Mesaj gönder
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Alıcı ve mesaj içeriği gerekli' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
