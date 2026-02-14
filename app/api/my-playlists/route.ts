import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSpotifyToken } from '@/lib/spotify-token';

export const dynamic = 'force-dynamic';

// Giriş yapmış kullanıcının Spotify playlistlerini getir
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
    const userId = searchParams.get('userId') || session.user.id;
    const limit = parseInt(searchParams.get('limit') || '50');

    const accessToken = await getUserSpotifyToken(userId);

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Spotify hesabı bağlı değil veya token süresi dolmuş' },
        { status: 401 }
      );
    }

    // Spotify API'den kullanıcının playlistlerini al
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!spotifyRes.ok) {
      const errText = await spotifyRes.text();
      console.error('Spotify playlists error:', spotifyRes.status, errText);
      return NextResponse.json(
        { success: false, error: `Spotify API hatası: ${spotifyRes.status}` },
        { status: spotifyRes.status }
      );
    }

    const data = await spotifyRes.json();

    // Playlistleri düzenle
    const playlists = (data.items || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      images: p.images || [],
      owner: {
        display_name: p.owner?.display_name || '',
        id: p.owner?.id || '',
      },
      tracks: {
        total: p.tracks?.total || p.items?.total || 0,
        href: p.tracks?.href || p.items?.href || '',
      },
      external_urls: p.external_urls || {},
      public: p.public,
      collaborative: p.collaborative,
    }));

    return NextResponse.json({
      success: true,
      data: playlists,
      total: data.total || playlists.length,
    });
  } catch (error: any) {
    console.error('My playlists error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
