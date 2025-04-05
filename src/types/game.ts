export interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  isGameOver: boolean;
  gridSize: number;
}

export interface EmojiTile {
  id: number;
  emoji: string;
  isSpy: boolean;
}

export interface GameConfig {
  initialTime: number;
  baseGridSize: number;
  maxLevel: number;
  timeDecrement: number;
} 