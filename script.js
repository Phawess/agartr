// script.js

// DOM Elementleri
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');

// Ekran boyutlarını ayarla
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

// Oyuncu nesnesi
const player = {
  x: gameCanvas.width / 2,
  y: gameCanvas.height / 2,
  size: 20,
  color: 'red',
  speed: 5,
};

// Oyuncu hareketi için tuş durumları
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Oyun başlatma
document.getElementById('start-button').addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  gameLoop();
});

// Klavye kontrolü
document.addEventListener('keydown', (event) => {
  if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
});

// Oyuncuyu çiz
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Oyuncu hareket ettir
function movePlayer() {
  if (keys.w && player.y > 0) player.y -= player.speed;
  if (keys.s && player.y < gameCanvas.height - player.size) player.y += player.speed;
  if (keys.a && player.x > 0) player.x -= player.speed;
  if (keys.d && player.x < gameCanvas.width - player.size) player.x += player.speed;
}

// Ana oyun döngüsü
function gameLoop() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Ekranı temizle
  movePlayer(); // Oyuncuyu hareket ettir
  drawPlayer(); // Oyuncuyu çiz
  requestAnimationFrame(gameLoop); // Döngüyü devam ettir
}
