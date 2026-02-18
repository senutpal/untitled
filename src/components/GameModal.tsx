import { useState, useEffect, useCallback } from 'react';

export default function GameModal() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="border px-4 py-8 w-32 text-center rounded-sm transition-all group hover:bg-black hover:border-black"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="block text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">👾</span>
          <span className="font-mono text-xs transition-colors group-hover:text-white" style={{ color: 'var(--text-secondary)' }}>snake.exe</span>
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="border px-4 py-8 w-32 text-center rounded-sm transition-all group hover:bg-black hover:border-black"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="block text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">🧱</span>
          <span className="font-mono text-xs transition-colors group-hover:text-white" style={{ color: 'var(--text-secondary)' }}>tetris.exe</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Game loader"
        >
          <div className="bg-[#1a1a1a] p-1 border border-gray-700 shadow-2xl">
            <div className="bg-black p-8 w-[300px] h-[400px] flex flex-col items-center justify-center text-center">
              <h2 className="font-mono text-green-500 text-xl mb-4">GAME_LOADER</h2>
              <div className="w-full bg-gray-900 h-1 mb-4 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '50%' }}></div>
              </div>
              <p className="font-mono text-gray-500 text-xs">Press ESC to exit process</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
