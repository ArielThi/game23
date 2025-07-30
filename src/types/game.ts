// Tipos TypeScript para el juego
export interface GameScore {
  id?: number;
  playerName: string;
  score: number;
  time: number;
  date: Date;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'bad' | 'coin';
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  time: number;
  playerName: string;
  gameOver: boolean;
}