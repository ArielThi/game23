<template>
  <div class="start-screen">
    <div class="container">
      <div class="header">
        <h1 class="title">🎮 Evita los Objetos</h1>
        <p class="subtitle">
          Muévete con las flechas del teclado, evita los objetos rojos y recoge las monedas doradas
        </p>
      </div>

      <div class="form-section">
        <div class="input-group">
          <label for="playerName">Nombre del Jugador</label>
          <input
            id="playerName"
            v-model="playerName"
            type="text"
            placeholder="Ingresa tu nombre"
            maxlength="20"
            @keyup.enter="startGame"
          />
        </div>
        
        <button 
          :disabled="!playerName.trim()" 
          @click="startGame"
          class="start-button"
        >
          Comenzar Juego
        </button>
      </div>

      <div class="instructions">
        <h3>Cómo Jugar</h3>
        <ul>
          <li>🏃‍♂️ Usa las flechas ← → para moverte</li>
          <li>❌ Evita los objetos rojos (Game Over)</li>
          <li>🪙 Recoge las monedas doradas (+10 puntos)</li>
          <li>⏱️ Sobrevive el mayor tiempo posible (+1 punto/segundo)</li>
          <li>🚀 La velocidad aumenta con el tiempo</li>
        </ul>
      </div>

      <div v-if="topScores.length > 0" class="leaderboard">
        <h3>🏆 Mejores Puntuaciones</h3>
        <div class="scores-list">
          <div 
            v-for="(score, index) in topScores" 
            :key="score.id" 
            class="score-item"
            :class="{ 'top-score': index === 0 }"
          >
            <span class="rank">#{{ index + 1 }}</span>
            <span class="name">{{ score.playerName }}</span>
            <span class="points">{{ score.score }} pts</span>
            <span class="time">{{ score.time }}s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { databaseService } from '../services/database';
import type { GameScore } from '../types/game';

const emit = defineEmits<{
  startGame: [playerName: string]
}>();

const playerName = ref('');
const topScores = ref<GameScore[]>([]);

const startGame = () => {
  if (playerName.value.trim()) {
    emit('startGame', playerName.value.trim());
  }
};

const loadTopScores = async () => {
  try {
    topScores.value = await databaseService.getTopScores(5);
  } catch (error) {
    console.error('Error loading top scores:', error);
  }
};

onMounted(() => {
  loadTopScores();
});
</script>

<style scoped>
.start-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.header {
  margin-bottom: 2.5rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3B82F6, #10B981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
}

.form-section {
  margin-bottom: 2.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #334155;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #3B82F6;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.start-button {
  background: linear-gradient(135deg, #3B82F6, #1d4ed8);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.instructions {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.instructions h3 {
  color: #f1f5f9;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.instructions ul {
  list-style: none;
  padding: 0;
}

.instructions li {
  color: #cbd5e1;
  padding: 0.5rem 0;
  font-size: 1rem;
  text-align: left;
}

.leaderboard {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

.leaderboard h3 {
  color: #f1f5f9;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  align-items: center;
}

.score-item.top-score {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border: 1px solid #F59E0B;
}

.rank {
  font-weight: bold;
  color: #F59E0B;
  font-size: 0.9rem;
}

.name {
  color: #f1f5f9;
  font-weight: 600;
  text-align: left;
}

.points {
  color: #10B981;
  font-weight: bold;
}

.time {
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .container {
    padding: 2rem;
    margin: 1rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .score-item {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }
  
  .points,
  .time {
    grid-column: 2;
    text-align: right;
  }
}
</style>