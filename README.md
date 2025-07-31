## 1. ¿Cómo funciona el juego?
El juego es un arcade donde el jugador debe moverse para esquivar objetos rojos y recoger monedas doradas.
Se controla con las flechas del teclado.
Por cada moneda recogida se suman 10 puntos.
Por cada segundo sobrevivido se suma 1 punto.
Si el jugador toca un objeto rojo, el juego termina y aparece la pantalla de Game Over mostrando la puntuación final, el tiempo sobrevivido y un ranking de los mejores puntajes.

## 2. ¿Cómo se conectan las distintas partes?
**Frontend:**
Hecho con Vue.js para la interfaz y Phaser para la lógica y renderizado del juego.
Los componentes de Vue controlan las pantallas de inicio, juego y Game Over.
El componente principal (App.vue) gestiona el estado global y comunica los eventos entre Vue y Phaser.

*Lógica del juego:*
Toda la lógica de colisiones, movimiento y generación de objetos está en GameScene.ts usando Phaser.
Cuando ocurre un evento importante (sube el score, pasa el tiempo, Game Over), se llama a un callback que actualiza el estado en Vue.
Base de datos local:

Se usa **IndexedDB** para guardar los puntajes localmente en el navegador.
Al terminar una partida, el puntaje se guarda y se actualiza la tabla de mejores puntajes.

## 3. ¿Cómo se integró y desplegó en GitHub Pages?

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

Configuración Manual GitHub Pages

1. Ve a **Settings** > **Pages** en tu repositorio
2. Selecciona **Source**: Deploy from branch
3. Selecciona **Branch**: `gh-pages`
4. Click **Save**

El juego estará disponible en: `https://[tu-usuario].github.io/[nombre-repositorio]`

### 4. Instalación en tu computadora 
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd evita-objetos-game

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
