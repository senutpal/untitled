const LASTFM_API = 'https://ws.audioscrobbler.com/2.0/';

export interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  isNowPlaying: boolean;
  playedAt?: number;
}

export async function getRecentTracks(): Promise<Track[]> {
  const apiKey = import.meta.env.LASTFM_API_KEY;
  const username = import.meta.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    console.warn('[lastfm] LASTFM_API_KEY or LASTFM_USERNAME not set');
    return [];
  }

  const response = await fetch(
    `${LASTFM_API}?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=4`
  );

  if (!response.ok) return [];

  const data = await response.json();
  const raw = data.recenttracks?.track;
  if (!raw) return [];

  const tracks = Array.isArray(raw) ? raw : [raw];

  return tracks.map((track: any) => ({
    title: track.name,
    artist: track.artist['#text'],
    album: track.album['#text'],
    albumArt: track.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || '',
    url: track.url,
    isNowPlaying: track['@attr']?.nowplaying === 'true',
    playedAt: track.date?.uts ? parseInt(track.date.uts) * 1000 : undefined,
  }));
}
