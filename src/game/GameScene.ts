// Escena principal del juego usando Phaser.js
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private objects: Phaser.GameObjects.Rectangle[] = [];
  private coins: Phaser.GameObjects.Rectangle[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private gameTimer!: Phaser.Time.TimerEvent;
  
  // Estado del juego
  public score = 0;
  public timeElapsed = 0;
  public gameSpeed = 1;
  public isGameOver = false;
  
  // Configuración del juego
  private readonly PLAYER_SPEED = 300;
  private readonly OBJECT_SPAWN_RATE = 0.008; // Probabilidad por frame (reducida)
  private readonly COIN_SPAWN_RATE = 0.005; // Probabilidad por frame (reducida)
  private readonly MIN_OBJECT_SPEED = 100;
  private readonly MAX_OBJECT_SPEED = 400;
  
  // Callbacks para comunicación con Vue
  public onScoreUpdate?: (score: number) => void;
  public onTimeUpdate?: (time: number) => void;
  public onGameOver?: () => void;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene created');
    
    // Crear el jugador
    this.player = this.add.rectangle(
      this.scale.width / 2, 
      this.scale.height - 50, 
      40, 
      40, 
      0x3B82F6
    );
    this.player.setStrokeStyle(2, 0xffffff);
    
    // Configurar controles
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // También añadir controles WASD
    const wasd = this.input.keyboard!.addKeys('W,S,A,D') as any;
    Object.assign(this.cursors, wasd);

    // Timer para el juego - actualizar cada segundo
    this.gameTimer = this.time.addEvent({
      delay: 1000, // Actualizar cada segundo
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
    
    // Inicializar valores
    this.score = 0;
    this.timeElapsed = 0;
    this.gameSpeed = 1;
    this.isGameOver = false;
    
    console.log('Game initialized with callbacks:', {
      onScoreUpdate: !!this.onScoreUpdate,
      onTimeUpdate: !!this.onTimeUpdate,
      onGameOver: !!this.onGameOver
    });
  }

  update() {
    if (this.isGameOver) return;

    // Movimiento del jugador
    this.handlePlayerMovement();
    
    // Generar objetos
    this.spawnObjects();
    
    // Actualizar objetos
    this.updateObjects();
    this.updateCoins();
    
    // Verificar colisiones
    this.checkCollisions();
    
    // Aumentar dificultad gradualmente
    this.updateDifficulty();
  }

  private handlePlayerMovement() {
    const speed = this.PLAYER_SPEED;
    const deltaTime = this.game.loop.delta / 1000;
    
    if (this.cursors.left.isDown) {
      this.player.x = Math.max(20, this.player.x - speed * deltaTime);
    }
    
    if (this.cursors.right.isDown) {
      this.player.x = Math.min(this.scale.width - 20, this.player.x + speed * deltaTime);
    }
  }

  private spawnObjects() {
    // Generar objetos malos
    if (Math.random() < this.OBJECT_SPAWN_RATE * this.gameSpeed) {
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const speed = Phaser.Math.Between(
        this.MIN_OBJECT_SPEED * this.gameSpeed,
        this.MAX_OBJECT_SPEED * this.gameSpeed
      );
      
      const badObject = this.add.rectangle(x, -20, 30, 30, 0xEF4444);
      badObject.setStrokeStyle(2, 0xff0000);
      badObject.setData('speed', speed);
      
      this.objects.push(badObject);
    }
    
    // Generar monedas
    if (Math.random() < this.COIN_SPAWN_RATE * this.gameSpeed) {
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const speed = Phaser.Math.Between(80, 200) * this.gameSpeed;
      
      const coin = this.add.rectangle(x, -20, 20, 20, 0xF59E0B);
      coin.setStrokeStyle(2, 0xffff00);
      coin.setData('speed', speed);
      
      this.coins.push(coin);
    }
  }

  private updateObjects() {
    const deltaTime = this.game.loop.delta / 1000;
    
    this.objects = this.objects.filter(obj => {
      const speed = obj.getData('speed');
      obj.y += speed * deltaTime;
      
      // Eliminar objetos que salieron de pantalla
      if (obj.y > this.scale.height + 50) {
        obj.destroy();
        return false;
      }
      
      return true;
    });
  }

  private updateCoins() {
    const deltaTime = this.game.loop.delta / 1000;
    
    this.coins = this.coins.filter(coin => {
      const speed = coin.getData('speed');
      coin.y += speed * deltaTime;
      
      // Eliminar monedas que salieron de pantalla
      if (coin.y > this.scale.height + 50) {
        coin.destroy();
        return false;
      }
      
      return true;
    });
  }

  private checkCollisions() {
    // Colisiones con objetos malos
    for (const obj of this.objects) {
      if (this.checkCollision(this.player, obj)) {
        console.log('Collision detected! Game Over');
        this.gameOver();
        return;
      }
    }
    
    // Colisiones con monedas
    this.coins = this.coins.filter(coin => {
      if (this.checkCollision(this.player, coin)) {
        this.score += 10;
        console.log('Coin collected! New score:', this.score);
        this.onScoreUpdate?.(this.score);
        
        // Efecto visual al recoger moneda
        this.createCoinEffect(coin.x, coin.y);
        
        coin.destroy();
        return false;
      }
      return true;
    });
  }

  private checkCollision(obj1: Phaser.GameObjects.Rectangle, obj2: Phaser.GameObjects.Rectangle): boolean {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();
    
    return Phaser.Geom.Rectangle.Overlaps(bounds1, bounds2);
  }

  private createCoinEffect(x: number, y: number) {
    // Crear efecto de partículas cuando se recoge una moneda
    const effect = this.add.text(x, y, '+10', {
      fontSize: '20px',
      color: '#F59E0B',
      fontStyle: 'bold'
    });
    
    this.tweens.add({
      targets: effect,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => effect.destroy()
    });
  }

  private updateTimer() {
    if (this.isGameOver) return;
    
    this.timeElapsed += 1;
    console.log('Timer updated:', this.timeElapsed);
    this.onTimeUpdate?.(this.timeElapsed);
    
    // Añadir puntos por tiempo de supervivencia (1 punto por segundo)
    this.score += 1;
    console.log('Score updated by time:', this.score);
    this.onScoreUpdate?.(this.score);
  }

  private updateDifficulty() {
    // Aumentar la velocidad del juego gradualmente
    this.gameSpeed = 1 + (this.timeElapsed / 30) * 0.3; // Aumenta 30% cada 30 segundos
  }

  private gameOver() {
    console.log('Game Over called');
    this.isGameOver = true;
    
    // Detener el timer
    if (this.gameTimer) {
      this.gameTimer.destroy();
    }
    
    // Detener todos los objetos
    
    // Mostrar efecto de game over
    // Detener todos los objetos (sin tintado porque no es compatible con rectángulos)
    // this.objects.forEach(obj => obj.setTint(0x666666));
    // this.coins.forEach(coin => coin.setTint(0x666666));
    // Mostrar efecto de game over (sin tintado)
    // this.player.setTint(0xff0000);
    
    console.log('Calling onGameOver callback');
    // Llamar callback
    this.onGameOver?.();
  }

  public resetGame() {
    console.log('Resetting game');
    
    // Limpiar objetos
    this.objects.forEach(obj => obj.destroy());
    this.coins.forEach(coin => coin.destroy());
    this.objects = [];
    this.coins = [];
    
    // Resetear estado
    this.score = 0;
    this.timeElapsed = 0;
    this.gameSpeed = 1;
    this.isGameOver = false;
    
    // Resetear jugador
    this.player.x = this.scale.width / 2;
    this.player.y = this.scale.height - 50;
    // this.player.clearTint(); // No compatible con rectángulos
    
    // Reiniciar timer
    if (this.gameTimer) {
      this.gameTimer.destroy();
    }
    
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
    
    // Actualizar UI
    this.onScoreUpdate?.(this.score);
    this.onTimeUpdate?.(this.timeElapsed);
  }

  public pauseGame() {
    this.scene.pause();
  }

  public resumeGame() {
    this.scene.resume();
  }
}