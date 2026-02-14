import { NextResponse } from 'next/server';
import { spotifyAPI } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Arama sorgusu gerekli',
        },
        { status: 400 }
      );
    }

    const playlists = await spotifyAPI.searchPlaylists(query, limit);

    return NextResponse.json({
      success: true,
      data: playlists,
    });
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Arama yapılamadı',
      },
      { status: 500 }
    );
  }
}