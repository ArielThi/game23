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

## 📊 Base de Datos (IndexedDB)

El juego utiliza IndexedDB para almacenar:
- **Nombre del jugador**
- **Puntuación final**
- **Tiempo de supervivencia**

---
