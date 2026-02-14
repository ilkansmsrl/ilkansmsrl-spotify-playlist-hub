import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSpotifyToken } from '@/lib/spotify-token';

export const dynamic = 'force-dynamic';

// Raw Spotify yanıtından track listesi çıkar
function extractTracks(data: any) {
  const tracksContainer = data.tracks || data.items;
  const trackItems = tracksContainer?.items || [];

  const tracks = trackItems
    .map((item: any) => {
      // Spotify artık .item kullanıyor (.track yerine)
      const t = item.track || item.item;
      if (!t) return null;
      return {
        id: t.id,
        name: t.name,
        duration_ms: t.duration_ms,
        artists:
          t.artists?.map((a: any) => ({
            id: a.id,
            name: a.name,
          })) || [],
        album: {
          id: t.album?.id,
          name: t.album?.name,
          images: t.album?.images || [],
        },
        external_urls: t.external_urls || {},
        preview_url: t.preview_url || null,
      };
    })
    .filter(Boolean);

  return { tracks, total: tracksContainer?.total || tracks.length };
}

// Raw Spotify yanıtından playlist bilgisi çıkar
function extractPlaylist(data: any, tracksTotal: number) {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    images: data.images || [],
    owner: {
      display_name: data.owner?.display_name || '',
      id: data.owner?.id || '',
    },
    tracks: {
      total: tracksTotal,
      href: (data.tracks || data.items)?.href || '',
    },
    external_urls: data.external_urls || {},
  };
}

// Playlist detaylarını ve şarkılarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playlistId = params.id;
    let token: string | null = null;

    // Giriş yapmış kullanıcının OAuth token'ını dene
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    


    if (userId) {
      token = await getUserSpotifyToken(userId);
    }

    // Yoksa Client Credentials token kullan
    if (!token) {
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
          body: 'grant_type=client_credentials',
        });
        const tokenData = await tokenRes.json();
        token = tokenData.access_token;
      } catch {
        return NextResponse.json(
          { success: false, error: 'Token alınamadı' },
          { status: 500 }
        );
      }
    }

    // Spotify API'den playlist detaylarını getir
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?market=TR`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Playlist bulunamadı' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const { tracks, total } = extractTracks(data);
    const playlist = extractPlaylist(data, total);

    return NextResponse.json({
      success: true,
      playlist,
      tracks,
    });
  } catch (error: any) {
    console.error('Playlist detail error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
