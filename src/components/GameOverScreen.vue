<template>
  <div class="game-over-screen">
    <div class="container">
      <div class="game-over-header">
        <h1 class="title">💥 Game Over</h1>
        <div class="final-stats">
          <div class="stat-card">
            <span class="stat-number">{{ finalScore }}</span>
            <span class="stat-label">Puntuación Final</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ formatTime(finalTime) }}</span>
            <span class="stat-label">Tiempo Sobrevivido</span>
          </div>
        </div>
      </div>

      <div class="performance-analysis">
        <h3>📊 Tu Rendimiento</h3>
        <div class="analysis-stats">
          <div class="analysis-item">
            <span class="analysis-label">Puntos por tiempo:</span>
            <span class="analysis-value">{{ finalTime }} pts</span>
          </div>
          <div class="analysis-item">
            <span class="analysis-label">Monedas recolectadas:</span>
            <span class="analysis-value">{{ coinsCollected }} monedas</span>
          </div>
          <div class="analysis-item">
            <span class="analysis-label">Puntos por monedas:</span>
            <span class="analysis-value">{{ coinsCollected * 10 }} pts</span>
          </div>
        </div>
      </div>

      <div class="leaderboard-section">
        <h3>🏆 Tabla de Puntuaciones</h3>
        <div class="scores-container">
          <div 
            v-for="(score, index) in topScores" 
            :key="score.id || index"
            class="score-row"
            :class="{ 
              'current-score': isCurrentScore(score),
              'top-score': index === 0 
            }"
          >
            <span class="position">#{{ index + 1 }}</span>
            <div class="player-info">
              <span class="player-name">{{ score.playerName }}</span>
              <span class="score-date">{{ formatDate(score.date) }}</span>
            </div>
            <span class="score-points">{{ score.score }}</span>
            <span class="score-time">{{ formatTime(score.time) }}</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="$emit('backToMenu')" class="action-button secondary">
          🏠 Menú Principal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { databaseService } from '../services/database';
import type { GameScore } from '../types/game';

interface Props {
  finalScore: number;
  finalTime: number;
  playerName: string;
}

const props = defineProps<Props>();


const topScores = ref<GameScore[]>([]);
const currentScoreId = ref<number | null>(null);

const coinsCollected = computed(() => {
  // Calcular monedas basado en la puntuación (puntuación - tiempo = monedas * 10)
  return Math.max(0, Math.floor((props.finalScore - props.finalTime) / 10));
});

const saveCurrentScore = async () => {
  try {
    const scoreData = {
      playerName: props.playerName,
      score: props.finalScore,
      time: props.finalTime,
      date: new Date()
    };
    
    currentScoreId.value = await databaseService.saveScore(scoreData);
    await loadTopScores();
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

const loadTopScores = async () => {
  try {
    topScores.value = await databaseService.getTopScores(10);
  } catch (error) {
    console.error('Error loading scores:', error);
  }
};

const isCurrentScore = (score: GameScore): boolean => {
  return score.id === currentScoreId.value;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  saveCurrentScore();
});
</script>

<style scoped>
.game-over-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  max-width: 700px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.game-over-header {
  margin-bottom: 2.5rem;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
}

.final-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #10B981;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 600;
}

.performance-analysis {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.performance-analysis h3 {
  color: #f1f5f9;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.analysis-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.analysis-label {
  color: #cbd5e1;
  font-weight: 500;
}

.analysis-value {
  color: #F59E0B;
  font-weight: bold;
}

.leaderboard-section {
  margin-bottom: 2.5rem;
}

.leaderboard-section h3 {
  color: #f1f5f9;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.scores-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.score-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  align-items: center;
  transition: all 0.3s ease;
}

.score-row:last-child {
  margin-bottom: 0;
}

.score-row.current-score {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
  border: 1px solid #3B82F6;
  transform: scale(1.02);
}

.score-row.top-score:not(.current-score) {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border: 1px solid #F59E0B;
}

.position {
  font-weight: bold;
  color: #F59E0B;
  font-size: 0.9rem;
  width: 30px;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.player-name {
  color: #f1f5f9;
  font-weight: 600;
  font-size: 1rem;
}

.score-date {
  color: #64748b;
  font-size: 0.8rem;
}

.score-points {
  color: #10B981;
  font-weight: bold;
  font-size: 1.1rem;
}

.score-time {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.action-button.primary {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button.primary:hover {
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Scrollbar personalizado */
.scores-container::-webkit-scrollbar {
  width: 6px;
}

.scores-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.scores-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.scores-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .container {
    padding: 2rem;
    margin: 1rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .final-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .score-row {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }
  
  .score-points,
  .score-time {
    grid-column: 2;
    text-align: right;
  }
  
  .analysis-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>