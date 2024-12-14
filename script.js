const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 20, speed: 2 };
let foods = [];

// Generate random food items
for (let i = 0; i < 50; i++) {
    foods.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 5
    });
}

// Update player position
document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - player.x;
    const dy = e.clientY - player.y;
    const angle = Math.atan2(dy, dx);
    player.x += Math.cos(angle) * player.speed;
    player.y += Math.sin(angle) * player.speed;
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // Draw and check collision with food
    foods = foods.filter(food => {
        const dist = Math.hypot(player.x - food.x, player.y - food.y);
        if (dist < player.size + food.size) {
            player.size += 0.5; // Grow player
            return false; // Remove food
        }
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        return true;
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
