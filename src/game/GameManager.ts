// Gestor principal del juego que conecta Phaser con Vue
import Phaser from 'phaser';
import { GameScene } from './GameScene';

export class GameManager {
  private game: Phaser.Game | null = null;
  private gameScene: GameScene | null = null;
  
  // Callbacks para comunicación con Vue
  public onScoreUpdate?: (score: number) => void;
  public onTimeUpdate?: (time: number) => void;
  public onGameOver?: () => void;

  initializeGame(container: HTMLElement) {
    // Destruir juego anterior si existe
    if (this.game) {
      this.game.destroy(true);
    }
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      backgroundColor: '#0f172a',
      scene: GameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
      }
    };

    this.game = new Phaser.Game(config);
    
    // Esperar a que la escena esté lista
    this.game.events.once('ready', () => {
      this.gameScene = this.game!.scene.getScene('GameScene') as GameScene;
      
      // Configurar callbacks
      this.gameScene.onScoreUpdate = (score) => {
        console.log('Score callback triggered:', score);
        this.onScoreUpdate?.(score);
      };
      this.gameScene.onTimeUpdate = (time) => {
        console.log('Time callback triggered:', time);
        this.onTimeUpdate?.(time);
      };
      this.gameScene.onGameOver = () => {
        console.log('Game over callback triggered');
        this.onGameOver?.();
      };
      
      console.log('GameManager initialized with callbacks');
    });
  }

  startGame() {
    console.log('Starting game');
    if (this.gameScene) {
      this.gameScene.resetGame();
    }
  }

  pauseGame() {
    if (this.gameScene) {
      this.gameScene.pauseGame();
    }
  }

  resumeGame() {
    if (this.gameScene) {
      this.gameScene.resumeGame();
    }
  }

  getCurrentScore(): number {
    return this.gameScene?.score || 0;
  }

  getCurrentTime(): number {
    return Math.floor(this.gameScene?.timeElapsed || 0);
  }

  isGameOver(): boolean {
    return this.gameScene?.isGameOver || false;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.gameScene = null;
    }
  }
}