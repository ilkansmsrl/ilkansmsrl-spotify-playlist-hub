import { NextResponse } from 'next/server';
import { spotifyAPI } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const categories = await spotifyAPI.getCategories(limit);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Kategoriler getirilemedi',
      },
      { status: 500 }
    );
  }
}