import type { APIRoute } from 'astro';
import { getRecentTracks } from '../../lib/lastfm';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const tracks = await getRecentTracks();
    return new Response(JSON.stringify(tracks), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[nowplaying] Failed to fetch tracks:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
