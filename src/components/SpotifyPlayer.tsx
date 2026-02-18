import { useState, useEffect } from 'react';

interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  progressMs: number;
  durationMs: number;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SpotifyPlayer() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch('/api/spotify');
        const data = await res.json();
        setTrack(data);
      } catch {
        setTrack(null);
      }
    }

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  const progress = track ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <div className="border p-6 backdrop-blur-sm rounded-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-sm flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: 'var(--border)' }}>
          {track?.albumArt ? (
            <img src={track.albumArt} alt={`${track.title} album art`} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>album art</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
            {track?.title ?? 'Not Playing'}
          </h4>
          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            {track?.artist ?? 'Connect Spotify to see what\'s playing'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          <span>{track ? formatTime(track.progressMs) : '0:00'}</span>
          <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: 'var(--text-primary)' }}></div>
          </div>
          <span>{track ? formatTime(track.durationMs) : '0:00'}</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button className="transition-colors" style={{ color: 'var(--text-secondary)' }} aria-label="Previous track">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
          </button>
          <button className="transition-colors" style={{ color: 'var(--text-primary)' }} aria-label={track?.isPlaying ? 'Pause' : 'Play'}>
            {track?.isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button className="transition-colors" style={{ color: 'var(--text-secondary)' }} aria-label="Next track">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          </button>
        </div>

        {/* Spotify connection */}
        {!track && (
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-mono text-center" style={{ color: 'var(--gutter-color)' }}>connect to spotify →</p>
          </div>
        )}
      </div>
    </div>
  );
}
