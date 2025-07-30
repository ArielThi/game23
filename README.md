# 🎮 Evita los Objetos - Juego Web

Un emocionante juego web desarrollado con **Vue.js** y **Phaser.js** donde debes esquivar objetos peligrosos mientras recoges monedas para obtener la puntuación más alta.

## 🚀 Características

- **Motor de juego:** Phaser.js para gráficos fluidos y física realista
- **Interfaz moderna:** Vue.js con componentes reactivos
- **Almacenamiento persistente:** IndexedDB para guardar puntuaciones
- **Responsive:** Adaptado para móviles, tablets y escritorio
- **GitHub Pages ready:** Configurado para deployment automático

## 🎯 Cómo Jugar

1. **Movimiento:** Usa las flechas ← y → del teclado para mover tu personaje
2. **Evita objetos rojos:** Tocar un objeto rojo termina el juego
3. **Recoge monedas:** Las monedas doradas te dan +10 puntos
4. **Supervivencia:** Ganas +1 punto por segundo que sobrevivas
5. **Dificultad progresiva:** La velocidad aumenta con el tiempo

## 🛠️ Tecnologías Utilizadas

- **Vue.js 3** - Framework reactivo para la interfaz
- **TypeScript** - Tipado estático para mejor mantenimiento
- **Phaser.js** - Motor de juego 2D profesional
- **IndexedDB** - Base de datos local para puntuaciones
- **Vite** - Build tool rápido y moderno
- **CSS3** - Estilos modernos con gradientes y glassmorphism

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes Vue
│   ├── StartScreen.vue     # Pantalla de inicio
│   ├── GameHUD.vue         # HUD del juego
│   └── GameOverScreen.vue  # Pantalla de game over
├── game/               # Lógica del juego Phaser
│   ├── GameScene.ts        # Escena principal del juego
│   └── GameManager.ts      # Gestor de conexión Vue-Phaser
├── services/           # Servicios de la aplicación
│   └── database.ts         # Servicio IndexedDB
├── types/              # Definiciones TypeScript
│   └── game.ts             # Tipos del juego
├── App.vue             # Componente principal
├── main.ts             # Punto de entrada
└── style.css           # Estilos globales
```

## 🔧 Instalación y Desarrollo

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd evita-objetos-game

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run deploy   # Deploy a GitHub Pages
```

## 🌐 Deployment en GitHub Pages

### Configuración Automática

1. **Crear repositorio en GitHub**
2. **Subir el código:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **Instalar gh-pages:**
```bash
npm install --save-dev gh-pages
```

4. **Deploy:**
```bash
npm run deploy
```

### Configuración Manual GitHub Pages

1. Ve a **Settings** > **Pages** en tu repositorio
2. Selecciona **Source**: Deploy from branch
3. Selecciona **Branch**: `gh-pages`
4. Click **Save**

El juego estará disponible en: `https://[tu-usuario].github.io/[nombre-repositorio]`

## 🎨 Personalización

### Modificar Configuración del Juego
Edita `src/game/GameScene.ts`:
```typescript
// Velocidad del jugador
private readonly PLAYER_SPEED = 300;

// Frecuencia de aparición de objetos
private readonly OBJECT_SPAWN_RATE = 0.02;

// Velocidades mínima y máxima de objetos
private readonly MIN_OBJECT_SPEED = 100;
private readonly MAX_OBJECT_SPEED = 400;
```

### Personalizar Colores
Edita `src/style.css`:
```css
:root {
  --color-primary: #3B82F6;    /* Azul principal */
  --color-secondary: #10B981;  /* Verde secundario */
  --color-accent: #F59E0B;     /* Naranja de acento */
}
```

### Modificar Tamaño del Juego
Edita `src/game/GameManager.ts`:
```typescript
const config: Phaser.Types.Core.GameConfig = {
  width: 800,   // Ancho del canvas
  height: 600,  // Alto del canvas
  // ...
};
```

## 📊 Base de Datos (IndexedDB)

El juego utiliza IndexedDB para almacenar:
- **Nombre del jugador**
- **Puntuación final**
- **Tiempo de supervivencia**
- **Fecha de la partida**

### Funciones Disponibles
```typescript
// Guardar puntuación
await databaseService.saveScore({
  playerName: 'Jugador',
  score: 1500,
  time: 120
});

// Obtener mejores puntuaciones
const topScores = await databaseService.getTopScores(10);

// Limpiar todas las puntuaciones
await databaseService.clearAllScores();
```

## 🐛 Solución de Problemas

### Error: "Canvas not found"
- Asegúrate de que el elemento `#game-canvas` existe en el DOM
- Verifica que Vue ha renderizado completamente antes de inicializar Phaser

### Problemas de rendimiento
- Ajusta `OBJECT_SPAWN_RATE` y `COIN_SPAWN_RATE` en GameScene.ts
- Limita el número máximo de objetos en pantalla

### Issues con GitHub Pages
- Verifica que `base: './'` esté configurado en `vite.config.ts`
- Asegúrate de que el branch `gh-pages` existe después del deploy

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 License

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🏆 Créditos

- **Phaser.js** - Motor de juego
- **Vue.js** - Framework de interfaz
- **Google Fonts** - Tipografía Inter
- **Vite** - Build tool

---

¡Disfruta jugando y que obtengas la puntuación más alta! 🎮✨