import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import SpotifyProvider from 'next-auth/providers/spotify';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user-read-email user-read-private playlist-read-private',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;

        // Spotify ID'yi user'a ekle
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { spotifyId: true, bio: true },
        });
        (session.user as any).spotifyId = dbUser?.spotifyId;
        (session.user as any).bio = dbUser?.bio;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'spotify' && account.providerAccountId) {
        try {
          // Kullanıcı zaten var mı kontrol et, yoksa adapter oluşturacak
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
          });
          if (existingUser) {
            await prisma.user.update({
              where: { id: user.id },
              data: { spotifyId: account.providerAccountId },
            });
          }
          // Kullanıcı yoksa adapter oluşturacak, sonra event ile güncelleyebiliriz
        } catch (error) {
          console.error('signIn callback error:', error);
          // Hatayı yutup giriş işlemine devam et
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    // Kullanıcı ilk kez oluşturulduğunda veya linkAccount olduğunda spotifyId kaydet
    async linkAccount({ user, account }) {
      if (account.provider === 'spotify' && account.providerAccountId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { spotifyId: account.providerAccountId },
        });
      }
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
