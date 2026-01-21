"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks";

const GRID_SIZE = 5;
const EMPTY_POSITION = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 };

type Tile = { value: number; row: number; col: number };
type Position = { row: number; col: number };

interface PuzzleState {
  tiles: Tile[];
  empty: Position;
  moves: number;
}

function createSolvedPuzzle(): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE - 1; i++) {
    tiles.push({
      value: i + 1,
      row: Math.floor(i / GRID_SIZE),
      col: i % GRID_SIZE,
    });
  }
  return tiles;
}

function shufflePuzzle(tiles: Tile[]): { tiles: Tile[]; empty: Position } {
  const newTiles = tiles.map(tile => ({ ...tile }));
  let empty = { ...EMPTY_POSITION };
  
  // Perform random valid moves
  for (let i = 0; i < 100; i++) {
    const moves: Position[] = [];
    if (empty.row > 0) moves.push({ row: empty.row - 1, col: empty.col });
    if (empty.row < GRID_SIZE - 1) moves.push({ row: empty.row + 1, col: empty.col });
    if (empty.col > 0) moves.push({ row: empty.row, col: empty.col - 1 });
    if (empty.col < GRID_SIZE - 1) moves.push({ row: empty.row, col: empty.col + 1 });
    
    const move = moves[Math.floor(Math.random() * moves.length)];
    const tileIndex = newTiles.findIndex(t => t.row === move.row && t.col === move.col);
    if (tileIndex !== -1) {
      newTiles[tileIndex] = { ...newTiles[tileIndex], row: empty.row, col: empty.col };
      empty = move;
    }
  }
  
  return { tiles: newTiles, empty };
}

function SlidingPuzzle() {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    tiles: [],
    empty: EMPTY_POSITION,
    moves: 0,
  });
  const reducedMotion = useReducedMotion();
  
  const initPuzzle = useCallback(() => {
    const solved = createSolvedPuzzle();
    const { tiles, empty } = shufflePuzzle(solved);
    setPuzzleState({ tiles, empty, moves: 0 });
  }, []);
  
  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);
  
  const isSolved = useMemo(() => {
    return puzzleState.tiles.length > 0 && puzzleState.tiles.every(tile => {
      const expectedRow = Math.floor((tile.value - 1) / GRID_SIZE);
      const expectedCol = (tile.value - 1) % GRID_SIZE;
      return tile.row === expectedRow && tile.col === expectedCol;
    });
  }, [puzzleState.tiles]);
  
  const handleTileClick = useCallback((tile: Tile) => {
    if (isSolved) return;
    
    setPuzzleState(prev => {
      // Check if tile is adjacent to empty
      const isAdjacent =
        (Math.abs(tile.row - prev.empty.row) === 1 && tile.col === prev.empty.col) ||
        (Math.abs(tile.col - prev.empty.col) === 1 && tile.row === prev.empty.row);
      
      if (!isAdjacent) return prev;
      
      return {
        tiles: prev.tiles.map(t =>
          t.value === tile.value
            ? { ...t, row: prev.empty.row, col: prev.empty.col }
            : t
        ),
        empty: { row: tile.row, col: tile.col },
        moves: prev.moves + 1,
      };
    });
  }, [isSolved]);
  
  const tileSize = 48;
  const gap = 4;
  
  return (
    <div className="flex flex-col items-center gap-4 print:hidden">
      <div 
        className="relative rounded-lg bg-muted p-2"
        role="application"
        aria-label="Sliding puzzle game"
        style={{ 
          width: GRID_SIZE * tileSize + (GRID_SIZE + 1) * gap,
          height: GRID_SIZE * tileSize + (GRID_SIZE + 1) * gap,
        }}
      >
        {puzzleState.tiles.map(tile => (
          <motion.button
            key={tile.value}
            onClick={() => handleTileClick(tile)}
            className="absolute flex items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ width: tileSize, height: tileSize }}
            animate={{
              left: gap + tile.col * (tileSize + gap),
              top: gap + tile.row * (tileSize + gap),
            }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
            aria-label={`Tile ${tile.value}. Row ${tile.row + 1}, column ${tile.col + 1}`}
          >
            {tile.value}
          </motion.button>
        ))}
      </div>
      
      <div 
        className="flex items-center gap-4 text-sm text-muted-foreground"
        aria-live="polite"
        aria-atomic="true"
      >
        <span>Moves: {puzzleState.moves}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={initPuzzle}
          className="gap-1"
          aria-label="Reset puzzle"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </Button>
      </div>
      
      {isSolved && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-medium text-primary"
        >
          <output aria-live="polite">Puzzle solved in {puzzleState.moves} moves!</output>
        </motion.span>
      )}
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="mb-2 font-mono text-8xl font-bold tracking-tighter text-primary">
          404
        </h1>
        <p className="mb-1 text-xl font-medium">Page not found</p>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 print:hidden">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          While you&apos;re here, solve this puzzle:
        </p>
        <SlidingPuzzle />
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/" className="gap-2" aria-label="Go to home page">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
