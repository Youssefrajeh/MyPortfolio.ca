import React, { useState, useEffect, useRef } from 'react';

interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  count: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

const BOARD_SIZE = 9;
const MINE_COUNT = 10;

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const [timer, setTimer] = useState(0);
  const [smiley, setSmiley] = useState<'🙂' | '😮' | '😵' | '😎'>('🙂');
  const timerIntervalRef = useRef<any>(null);

  // Initialize Board
  const initBoard = () => {
    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimer(0);
    setMinesLeft(MINE_COUNT);
    setGameStatus('idle');
    setSmiley('🙂');

    // Create empty board
    const newBoard: Cell[][] = Array(BOARD_SIZE)
      .fill(null)
      .map((_, y) =>
        Array(BOARD_SIZE)
          .fill(null)
          .map((_, x) => ({
            x,
            y,
            isMine: false,
            count: 0,
            isRevealed: false,
            isFlagged: false
          }))
      );

    // Place mines randomly
    let placedMines = 0;
    while (placedMines < MINE_COUNT) {
      const rx = Math.floor(Math.random() * BOARD_SIZE);
      const ry = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[ry][rx].isMine) {
        newBoard[ry][rx].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbor counts
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (newBoard[y][x].isMine) continue;
        let count = 0;
        // Check 8 neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE) {
              if (newBoard[ny][nx].isMine) count++;
            }
          }
        }
        newBoard[y][x].count = count;
      }
    }

    setBoard(newBoard);
  };

  useEffect(() => {
    initBoard();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Timer Ticker
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => Math.min(prev + 1, 999));
      }, 1000);
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [gameStatus]);

  // Reveal Cell logic
  const revealCell = (x: number, y: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost' || board[y][x].isRevealed || board[y][x].isFlagged) return;

    if (gameStatus === 'idle') {
      setGameStatus('playing');
    }

    const nextBoard = [...board.map((row) => [...row])];
    
    // If mine is clicked -> Game Over
    if (nextBoard[y][x].isMine) {
      nextBoard[y][x].isRevealed = true;
      // Reveal all other mines
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (nextBoard[r][c].isMine) {
            nextBoard[r][c].isRevealed = true;
          }
        }
      }
      setBoard(nextBoard);
      setGameStatus('lost');
      setSmiley('😵');
      return;
    }

    // Cascade reveal
    const queue: [number, number][] = [[x, y]];
    nextBoard[y][x].isRevealed = true;

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      const cell = nextBoard[cy][cx];

      if (cell.count === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = cy + dy;
            const nx = cx + dx;
            if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE) {
              const neighbor = nextBoard[ny][nx];
              if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
                neighbor.isRevealed = true;
                queue.push([nx, ny]);
              }
            }
          }
        }
      }
    }

    // Check Win Condition
    let unrevealedSafeCells = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!nextBoard[r][c].isMine && !nextBoard[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    setBoard(nextBoard);

    if (unrevealedSafeCells === 0) {
      setGameStatus('won');
      setSmiley('😎');
      setMinesLeft(0);
    }
  };

  // Toggle Flag
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameStatus === 'lost' || gameStatus === 'won' || board[y][x].isRevealed) return;

    if (gameStatus === 'idle') {
      setGameStatus('playing');
    }

    const nextBoard = [...board.map((row) => [...row])];
    const cell = nextBoard[y][x];
    const nextFlagged = !cell.isFlagged;
    cell.isFlagged = nextFlagged;
    
    setBoard(nextBoard);
    setMinesLeft((prev) => prev + (nextFlagged ? -1 : 1));
  };

  // Color mappings for Minesweeper numbers
  const numberColors = [
    '', // 0
    'text-blue-800 font-bold',     // 1
    'text-green-700 font-bold',    // 2
    'text-red-600 font-bold',      // 3
    'text-purple-900 font-bold',   // 4
    'text-red-950 font-bold',      // 5
    'text-teal-700 font-bold',     // 6
    'text-black font-bold',        // 7
    'text-gray-500 font-bold'      // 8
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-[#c0c0c0] p-1 font-mono text-black">
      {/* Game Window Border Bevels */}
      <div className="win95-raised p-1.5 flex flex-col gap-2 border-2">
        {/* Header (Mines, Smiley, Timer) */}
        <div className="win95-sunken flex items-center justify-between px-3 py-1.5 bg-[#c0c0c0] border-2">
          {/* Mine Counter */}
          <div className="bg-black text-[#ff0000] px-2 py-0.5 font-bold text-xl rounded h-8 min-w-[50px] flex items-center justify-center select-none tracking-widest border border-[#808080] tabular-nums">
            {String(Math.max(0, minesLeft)).padStart(3, '0')}
          </div>

          {/* Smiley Reset Button */}
          <button
            onClick={initBoard}
            onMouseDown={() => smiley === '🙂' && setSmiley('😮')}
            onMouseUp={() => smiley === '😮' && setSmiley('🙂')}
            className="win95-button w-8 h-8 text-xl flex items-center justify-center p-0 select-none border-2"
          >
            {smiley}
          </button>

          {/* Timer */}
          <div className="bg-black text-[#ff0000] px-2 py-0.5 font-bold text-xl rounded h-8 min-w-[50px] flex items-center justify-center select-none tracking-widest border border-[#808080] tabular-nums">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* Board Grid */}
        <div className="win95-sunken bg-[#808080] p-[2px] border-2">
          <div 
            className="grid gap-[1px]" 
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
            onMouseDown={() => gameStatus === 'playing' && setSmiley('😮')}
            onMouseUp={() => gameStatus === 'playing' && setSmiley('🙂')}
          >
            {board.map((row, y) =>
              row.map((cell, x) => {
                let cellContent = '';
                let cellClass = 'w-6 h-6 flex items-center justify-center text-sm font-extrabold select-none ';

                if (cell.isRevealed) {
                  cellClass += 'bg-[#c0c0c0] border border-t-[#808080] border-l-[#808080] border-r-transparent border-b-transparent';
                  if (cell.isMine) {
                    cellContent = '💣';
                    cellClass += ' bg-red-500';
                  } else if (cell.count > 0) {
                    cellContent = String(cell.count);
                    cellClass += ` ${numberColors[cell.count]}`;
                  }
                } else {
                  cellClass += 'win95-raised border cursor-default active:border-t-[#808080] active:border-l-[#808080] active:border-r-transparent active:border-b-transparent';
                  if (cell.isFlagged) {
                    cellContent = '🚩';
                  }
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => revealCell(x, y)}
                    onContextMenu={(e) => handleRightClick(e, x, y)}
                    className={cellClass}
                    style={{ width: '22px', height: '22px' }}
                  >
                    {cellContent}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Game Instruction */}
      <div className="text-[10px] text-gray-700 mt-2 flex flex-col items-center">
        <span>Left Click: Reveal | Right Click: Flag</span>
        {gameStatus === 'won' && <span className="text-green-800 font-bold mt-1">🎉 You Won! 😎</span>}
        {gameStatus === 'lost' && <span className="text-red-700 font-bold mt-1">💥 Game Over! 😵</span>}
      </div>
    </div>
  );
};

export default Minesweeper;
