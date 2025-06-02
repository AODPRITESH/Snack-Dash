const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
let snake = [{ x: 5 * scale, y: 5 * scale }];
let food = {
    x: Math.floor(Math.random() * canvas.width / scale) * scale,
    y: Math.floor(Math.random() * canvas.height / scale) * scale
};
let dx = scale;
let dy = 0;
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
document.getElementById("highestScore").innerText = highestScore;
let gameSpeed = 200;

const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");

function drawGrid() {
    ctx.strokeStyle = '#444';
    for (let x = 0; x < canvas.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
function drawSnake() {
    snake.forEach((segment, index) => {
        // Create gradient effect for the snake
        const gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + scale, segment.y + scale);
        if (index === 0) {
            gradient.addColorStop(0, '#00ff88'); // Head: Bright green
            gradient.addColorStop(1, '#006644');
        } else {
            gradient.addColorStop(0, '#32CD32'); // Body: Lime green gradient
            gradient.addColorStop(1, '#228B22');
        }

        ctx.fillStyle = gradient;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(segment.x, segment.y, scale, scale, 6); // Rounded corners
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
    });
}
function drawFood() {
    const gradient = ctx.createRadialGradient(food.x + scale / 2, food.y + scale / 2, 2, food.x + scale / 2, food.y + scale / 2, scale / 2);
    gradient.addColorStop(0, '#ff4d4d');
    gradient.addColorStop(1, '#b30000');

    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ff4d4d';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(food.x + scale / 2, food.y + scale / 2, scale / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
}



function updateSnakePosition() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("currentScore").innerText = score;
        if (score > highestScore) {
            highestScore = score;
            document.getElementById("highestScore").innerText = highestScore;
            localStorage.setItem("highestScore", highestScore);
        }
        food = {
            x: Math.floor(Math.random() * canvas.width / scale) * scale,
            y: Math.floor(Math.random() * canvas.height / scale) * scale
        };
    } else {
        snake.pop();
    }
}

function checkCollisions() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameLoopInterval);
    gameOverScreen.classList.remove("hidden");
}

restartButton.addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    resetGame();
    startGameLoop();
});

function resetGame() {
    snake = [{ x: 5 * scale, y: 5 * scale }];
    dx = scale;
    dy = 0;
    score = 0;
    document.getElementById("currentScore").innerText = score;
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) {
                dx = 0;
                dy = -scale;
            }
            break;
        case "ArrowDown":
            if (dy === 0) {
                dx = 0;
                dy = scale;
            }
            break;
        case "ArrowLeft":
            if (dx === 0) {
                dx = -scale;
                dy = 0;
            }
            break;
        case "ArrowRight":
            if (dx === 0) {
                dx = scale;
                dy = 0;
            }
            break;
        case " ":
            dx = 0;
            dy = 0; // Stop snake movement
            break;
    }
});

document.getElementById("difficulty").addEventListener("change", (e) => {
    switch (e.target.value) {
        case "easy":
            gameSpeed = 200;
            break;
        case "medium":
            gameSpeed = 100;
            break;
        case "hard":
            gameSpeed = 50;
            break;
    }
    restartGameLoop();
});

let gameLoopInterval;
function startGameLoop() {
    gameLoopInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        drawGrid(); // Draw the grid
        updateSnakePosition();
        checkCollisions();
        drawSnake();
        drawFood();
    }, gameSpeed);
}

function restartGameLoop() {
    clearInterval(gameLoopInterval);
    startGameLoop();
}

startGameLoop();
