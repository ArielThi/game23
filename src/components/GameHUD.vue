<template>
  <div class="game-hud">
    <div class="hud-container">
      <div class="stat-group">
        <div class="stat-item">
          <span class="stat-label">Puntuación</span>
          <span class="stat-value score">{{ score }}</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">Tiempo</span>
          <span class="stat-value time">{{ formatTime(time) }}</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">Jugador</span>
          <span class="stat-value player">{{ playerName }}</span>
        </div>
      </div>
      
      <div class="controls">
        <button @click="togglePause" class="control-button">
          {{ isPaused ? '▶️' : '⏸️' }}
        </button>
        
        <button @click="$emit('quitGame')" class="control-button quit">
          🚪 Salir
        </button>
      </div>
    </div>
    
    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-content">
        <h2>⏸️ Juego Pausado</h2>
        <p>Presiona el botón de play para continuar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number;
  time: number;
  playerName: string;
  isPaused: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  togglePause: []
  quitGame: []
}>();

const togglePause = () => {
  emit('togglePause');
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.game-hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.hud-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, transparent 100%);
  backdrop-filter: blur(5px);
  pointer-events: auto;
}

.stat-group {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.25rem;
}

.stat-value.score {
  color: #10B981;
}

.stat-value.time {
  color: #3B82F6;
}

.stat-value.player {
  color: #F59E0B;
  font-size: 1.2rem;
}

.controls {
  display: flex;
  gap: 1rem;
}

.control-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.control-button.quit {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.control-button.quit:hover {
  background: rgba(239, 68, 68, 0.3);
}

.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  pointer-events: auto;
}

.pause-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pause-content h2 {
  color: #f1f5f9;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.pause-content p {
  color: #94a3b8;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .hud-container {
    padding: 1rem;
  }
  
  .stat-group {
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .stat-value.player {
    font-size: 1rem;
  }
  
  .controls {
    gap: 0.5rem;
  }
  
  .control-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>