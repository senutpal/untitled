import { useState, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  isNowPlaying: boolean;
  playedAt?: number;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NowPlaying() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch('/api/nowplaying');
        const data = await res.json();
        setTracks(data);
      } catch {
        setTracks([]);
      }
    }

    fetchTracks();
    const interval = setInterval(fetchTracks, 30000);
    return () => clearInterval(interval);
  }, []);

  const current = tracks[0];
  const recent = tracks.slice(1, 4);

  return (
      <div className="np-card">
        {/* Header bar */}
        <div className="np-header">
          <div className="np-status">
            {current?.isNowPlaying ? (
              <>
                <span className="np-dot active" />
                <span style={{ color: 'var(--accent)' }}>now playing</span>
              </>
            ) : (
              <>
                <span className="np-dot idle" />
                <span style={{ color: 'var(--text-muted)' }}>
                  {current?.playedAt ? timeAgo(current.playedAt) : 'idle'}
                </span>
              </>
            )}
          </div>
          {current && (
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(`${current.artist} ${current.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="np-spotify"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>play on spotify</span>
            </a>
          )}
        </div>

        {/* Main track display */}
        {current ? (
          <div className="np-main">
            <div className={`np-art${current.isNowPlaying ? ' is-playing' : ''}`}>
              {current.albumArt ? (
                <img src={current.albumArt} alt={current.title} className='grayscale' />
              ) : (
                <div className="np-art-empty">♪</div>
              )}
            </div>
            <div className="np-info">
              <p className="np-title">{current.title.toLowerCase()}</p>
              <p className="np-artist">{current.artist.toLowerCase()}</p>
              {current.album && <p className="np-album">{current.album.toLowerCase()}</p>}
            </div>
          </div>
        ) : (
          <div className="np-empty">
            <div className="np-empty-icon">♪</div>
            <p className="np-empty-text">waiting for signal...</p>
          </div>
        )}

        {/* Recent tracks */}
        {recent.length > 0 && (
          <div className="np-recent">
            {recent.map((track, i) => (
              <a
                key={`${track.artist}-${track.title}`}
                href={`https://open.spotify.com/search/${encodeURIComponent(`${track.artist} ${track.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="np-track"
              >
                <div className="np-track-art">
                  {track.albumArt && <img className='grayscale' src={track.albumArt} alt="" />}
                </div>
                <div className="np-track-info">
                  <p className="np-track-title">{track.title.toLowerCase()}</p>
                  <p className="np-track-artist">{track.artist.toLowerCase()}</p>
                </div>
                {track.playedAt && (
                  <span className="np-track-time">{timeAgo(track.playedAt)}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
  );
}
