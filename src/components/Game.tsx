import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, EmojiTile, GameConfig } from '../types/game';
import ProgressBar from './ProgressBar';

const gameConfig: GameConfig = {
  initialTime: 30,
  baseGridSize: 4,
  maxLevel: 10,
  timeDecrement: 2,
};

const emojis = {
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
  mouse: '🐭',
  hamster: '🐹',
};

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: gameConfig.initialTime,
    isGameOver: false,
    gridSize: gameConfig.baseGridSize,
  });

  const [showWelcome, setShowWelcome] = useState(true);
  const [tiles, setTiles] = useState<EmojiTile[]>([]);
  const [lastScore, setLastScore] = useState(0);

  const generateTiles = () => {
    const size = gameState.gridSize * gameState.gridSize;
    const mainEmoji = Object.values(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)];
    const spyEmoji = Object.values(emojis).filter(e => e !== mainEmoji)[
      Math.floor(Math.random() * (Object.keys(emojis).length - 1))
    ];
    const spyPosition = Math.floor(Math.random() * size);

    const newTiles = Array(size).fill(null).map((_, index) => ({
      id: index,
      emoji: index === spyPosition ? spyEmoji : mainEmoji,
      isSpy: index === spyPosition,
    }));

    setTiles(newTiles);
  };

  useEffect(() => {
    generateTiles();
  }, [gameState.level]);

  useEffect(() => {
    if (!gameState.isGameOver && gameState.timeLeft > 0 && !showWelcome) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          isGameOver: prev.timeLeft <= 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isGameOver, gameState.timeLeft, showWelcome]);

  const handleTileClick = (tile: EmojiTile) => {
    if (gameState.isGameOver || showWelcome) return;

    if (tile.isSpy) {
      setLastScore(Math.ceil(gameState.timeLeft * gameState.level));
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        score: prev.score + Math.ceil(prev.timeLeft * prev.level),
        timeLeft: Math.max(gameConfig.initialTime - (prev.level * gameConfig.timeDecrement), 10),
        gridSize: Math.min(prev.gridSize + (prev.level % 2 === 0 ? 1 : 0), 8),
      }));
    } else {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  };

  const resetGame = () => {
    setGameState({
      level: 1,
      score: 0,
      timeLeft: gameConfig.initialTime,
      isGameOver: false,
      gridSize: gameConfig.baseGridSize,
    });
    setShowWelcome(false);
  };

  const startGame = () => {
    setShowWelcome(false);
  };

  return (
    <div className="w-full h-full bg-game-bg flex items-center justify-center overflow-hidden">
      <div className="game-container p-4">
        <div className="w-[640px] relative">
          <AnimatePresence mode="wait" initial={false}>
            {showWelcome ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center absolute w-full"
                layout="position"
              >
                <h1 className="text-5xl font-bold mb-6 text-game-text">Emoji Spy</h1>
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-game-text">How to Play</h2>
                  <p className="text-lg mb-4 text-game-secondary">
                    Find the different emoji among identical ones! Each level gets faster and more challenging.
                  </p>
                  <ul className="text-left space-y-2 mb-6 text-game-secondary">
                    <li>• Click on the different emoji to advance to the next level</li>
                    <li>• Each correct answer gives you points based on time remaining</li>
                    <li>• The grid gets larger as you progress</li>
                    <li>• Time decreases with each level</li>
                  </ul>
                  <button
                    onClick={startGame}
                    className="bg-game-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    Start Game
                  </button>
                </div>
              </motion.div>
            ) : gameState.isGameOver ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center absolute w-full"
                layout="position"
              >
                <h2 className="text-4xl font-bold mb-4 text-game-text">Game Over!</h2>
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                  <p className="text-2xl mb-2 text-game-secondary">Final Score</p>
                  <p className="text-5xl font-bold text-game-primary mb-6">{gameState.score}</p>
                  <button
                    onClick={resetGame}
                    className="bg-game-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={gameState.level}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 absolute w-full"
                layout="position"
              >
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2 text-game-text">Emoji Spy</h1>
                  <div className="flex justify-center gap-4 text-xl mb-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-game-secondary">Level:</span>{" "}
                      <span className="font-bold text-game-primary">{gameState.level}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-game-secondary">Score:</span>{" "}
                      <span className="font-bold text-game-primary">{gameState.score}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-game-secondary">Time:</span>{" "}
                      <span className="font-bold text-game-primary">{gameState.timeLeft}s</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <ProgressBar 
                      timeLeft={gameState.timeLeft} 
                      totalTime={gameConfig.initialTime - ((gameState.level - 1) * gameConfig.timeDecrement)} 
                    />
                  </div>
                </div>

                {lastScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-xl text-game-success font-semibold">
                      +{lastScore} points!
                    </p>
                  </motion.div>
                )}

                <motion.div
                  className="emoji-grid overflow-hidden"
                  style={{
                    gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)`,
                  }}
                  layout="position"
                >
                  {tiles.map((tile) => (
                    <motion.button
                      key={tile.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTileClick(tile)}
                      className="aspect-square w-full bg-white rounded-xl shadow-game-tile hover:shadow-game-tile-hover flex items-center justify-center text-2xl transition-all duration-200"
                      layout="position"
                    >
                      {tile.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 