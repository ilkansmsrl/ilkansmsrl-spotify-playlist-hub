import { prisma } from '@/lib/prisma';

/**
 * Kullanıcının Spotify OAuth token'ını DB'den al, gerekirse yenile
 */
export async function getUserSpotifyToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'spotify',
    },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  });

  if (!account?.access_token) return null;

  let accessToken = account.access_token;

  // Token süresi dolmuşsa yenile
  if (account.expires_at && account.expires_at * 1000 < Date.now()) {
    if (!account.refresh_token) return null;

    try {
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: account.refresh_token,
        }),
      });

      if (!tokenRes.ok) return null;

      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;

      // Yeni token'ı DB'ye kaydet
      await prisma.account.updateMany({
        where: {
          userId,
          provider: 'spotify',
        },
        data: {
          access_token: tokenData.access_token,
          expires_at: Math.floor(Date.now() / 1000) + tokenData.expires_in,
          ...(tokenData.refresh_token
            ? { refresh_token: tokenData.refresh_token }
            : {}),
        },
      });
    } catch {
      return null;
    }
  }

  return accessToken;
}
