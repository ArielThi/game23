<template>
  <div class="app">
    <!-- Pantalla de inicio -->
    <StartScreen 
      v-if="gameState === 'start'" 
      @start-game="handleStartGame"
    />
    
    <!-- Pantalla de juego -->
    <div v-else-if="gameState === 'playing'" class="game-container">
      <GameHUD 
        :score="currentScore"
        :time="currentTime"
        :player-name="playerName"
        :is-paused="isPaused"
        @toggle-pause="togglePause"
        @quit-game="quitGame"
      />
      
      <div id="game-canvas" class="game-canvas"></div>
    </div>
    
    <!-- Pantalla de Game Over -->
    <GameOverScreen
      v-else-if="gameState === 'gameOver'"
      :final-score="finalScore"
      :final-time="finalTime"
      :player-name="playerName"
      @play-again="playAgain"
      @back-to-menu="backToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import StartScreen from './components/StartScreen.vue';
import GameHUD from './components/GameHUD.vue';
import GameOverScreen from './components/GameOverScreen.vue';
import { GameManager } from './game/GameManager';

type GameState = 'start' | 'playing' | 'gameOver';

// Estado del juego
const gameState = ref<GameState>('start');
const gameManager = new GameManager();

// Estado del jugador
const playerName = ref('');
const currentScore = ref(0);
const currentTime = ref(0);
const finalScore = ref(0);
const finalTime = ref(0);
const isPaused = ref(false);

// Manejadores de eventos del juego
const handleStartGame = (name: string) => {
  playerName.value = name;
  gameState.value = 'playing';
  
  // Esperar un momento para que el DOM se actualice
  setTimeout(() => {
    initializeGame();
  }, 100);
};

const initializeGame = () => {
  const gameContainer = document.getElementById('game-canvas');
  if (!gameContainer) return;
  
  console.log('Initializing game with player:', playerName.value);
  
  // Configurar callbacks del game manager
  gameManager.onScoreUpdate = (score: number) => {
    console.log('App received score update:', score);
    currentScore.value = score;
  };
  
  gameManager.onTimeUpdate = (time: number) => {
    console.log('App received time update:', time);
    currentTime.value = time;
  };
  
  gameManager.onGameOver = () => {
    console.log('App received game over');
    finalScore.value = gameManager.getCurrentScore();
    finalTime.value = gameManager.getCurrentTime();
    console.log('Final stats:', { score: finalScore.value, time: finalTime.value });
    gameState.value = 'gameOver';
  };
  
  // Inicializar el juego
  gameManager.initializeGame(gameContainer);
  
  // Esperar un momento antes de iniciar
  setTimeout(() => {
    gameManager.startGame();
    
    // Resetear estado
    currentScore.value = 0;
    currentTime.value = 0;
    isPaused.value = false;
  }, 500);
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  
  if (isPaused.value) {
    gameManager.pauseGame();
  } else {
    gameManager.resumeGame();
  }
};

const quitGame = () => {
  if (confirm('¿Estás seguro de que quieres salir del juego?')) {
    gameManager.destroy();
    gameState.value = 'start';
    resetGameState();
  }
};

const playAgain = () => {
  gameState.value = 'playing';
  
  setTimeout(() => {
    gameManager.startGame();
    currentScore.value = 0;
    currentTime.value = 0;
    isPaused.value = false;
  }, 100);
};

const backToMenu = () => {
  gameManager.destroy();
  gameState.value = 'start';
  resetGameState();
};

const resetGameState = () => {
  playerName.value = '';
  currentScore.value = 0;
  currentTime.value = 0;
  finalScore.value = 0;
  finalTime.value = 0;
  isPaused.value = false;
};

// Manejar eventos de teclado para pausa
const handleKeyPress = (event: KeyboardEvent) => {
  if (gameState.value === 'playing') {
    if (event.code === 'Space' || event.code === 'Escape') {
      event.preventDefault();
      togglePause();
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
  gameManager.destroy();
});
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  background: #0f172a;
  position: relative;
}

.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.game-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* Asegurar que el canvas de Phaser se centre correctamente */
:deep(canvas) {
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .game-canvas {
    padding: 1rem;
  }
  
  :deep(canvas) {
    width: 100% !important;
    height: auto !important;
  }
}
</style>