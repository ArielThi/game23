// Servicio para gestión de IndexedDB
import type { GameScore } from '../types/game';

class DatabaseService {
  private dbName = 'AvoidObjectsGame';
  private version = 1;
  private storeName = 'scores';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Crear índices para búsquedas eficientes
          store.createIndex('score', 'score', { unique: false });
          store.createIndex('playerName', 'playerName', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  async saveScore(score: Omit<GameScore, 'id'>): Promise<number> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const scoreWithDate = {
        ...score,
        date: new Date()
      };
      
      console.log('Saving score to database:', scoreWithDate);
      
      const request = store.add({
        ...scoreWithDate
      });

      request.onerror = () => {
        console.error('Error saving score:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log('Score saved successfully with ID:', request.result);
        resolve(request.result as number);
      };
    });
  }

  async getTopScores(limit: number = 10): Promise<GameScore[]> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('score');
      
      const request = index.openCursor(null, 'prev');
      const scores: GameScore[] = [];
      let count = 0;

      request.onerror = () => {
        console.error('Error getting top scores:', request.error);
        reject(request.error);
      };
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor && count < limit) {
          scores.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          console.log('Retrieved top scores:', scores);
          resolve(scores);
        }
      };
    });
  }

  async getAllScores(): Promise<GameScore[]> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearAllScores(): Promise<void> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const databaseService = new DatabaseService();