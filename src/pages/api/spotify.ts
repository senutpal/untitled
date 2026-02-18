import type { APIRoute } from 'astro';
import { getNowPlaying } from '../../lib/spotify';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const track = await getNowPlaying();
    return new Response(JSON.stringify(track), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return new Response(JSON.stringify(null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
