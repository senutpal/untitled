const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

export interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  progressMs: number;
  durationMs: number;
}

async function getAccessToken(): Promise<string> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

  const basic = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
  const accessToken = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  const data = await response.json();

  if (!data.item) return null;

  return {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
    albumArt: data.item.album.images[0]?.url ?? '',
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
  };
}
