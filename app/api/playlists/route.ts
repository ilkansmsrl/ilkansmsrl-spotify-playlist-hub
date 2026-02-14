import { NextResponse } from 'next/server';
import { spotifyAPI } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    let playlists;

    if (category) {
      // Kategori bazlı playlistler
      playlists = await spotifyAPI.getCategoryPlaylists(category, limit);
    } else {
      // Featured playlistler
      playlists = await spotifyAPI.getFeaturedPlaylists(limit);
    }

    return NextResponse.json({
      success: true,
      data: playlists,
    });
  } catch (error: any) {
    console.error('Playlist API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Playlistler getirilemedi',
      },
      { status: 500 }
    );
  }
}