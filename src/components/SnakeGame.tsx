import { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

const createFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef<Direction>(direction);
  const gameLoopRef = useRef<number | null>(null);

  // Update ref when direction changes to avoid closure stale state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('UP');
    directionRef.current = 'UP';
    setFood(createFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && !gameOver) {
      setIsPaused(p => !p);
      return;
    }

    if (gameOver && e.key === 'Enter') {
      resetGame();
      return;
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
        setFood(createFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, highScore]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused, speed]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-md mb-4 px-4">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm uppercase tracking-wider">Score</span>
          <span className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-mono">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-sm uppercase tracking-wider">High Score</span>
          <span className="text-3xl font-bold text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] font-mono">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 rounded-xl p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Grid Background */}
        <div 
          className="grid bg-black/80 rounded-lg overflow-hidden relative"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${
                  isHead 
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-10' 
                    : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.8)]'
                }`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  transform: 'scale(0.9)', // Slight gap between segments
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.8)',
            }}
          />
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            <h2 className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">GAME OVER</h2>
            <p className="text-gray-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all uppercase tracking-widest"
            >
              Play Again
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
            <h2 className="text-3xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-500 text-sm flex gap-4 font-mono">
        <span>[W,A,S,D] / Arrows to move</span>
        <span>[SPACE] to pause</span>
      </div>
    </div>
  );
}
