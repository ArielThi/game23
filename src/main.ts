import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Inicializar la aplicación Vue
const app = createApp(App)

// Configurar el manejo global de errores
app.config.errorHandler = (error, info) => {
  console.error('Error global capturado:', error, info);
}

// Montar la aplicación
app.mount('#app')

// Remover el loading screen cuando la app esté lista
setTimeout(() => {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
}, 1000);