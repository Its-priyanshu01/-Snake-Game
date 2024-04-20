const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const pauseButton = document.getElementById('pauseButton');

// Define constants
const tileSize = 20;
const canvasSize = canvas.width / tileSize;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop = null;
let isPaused = false;

// Event listeners
startButton.addEventListener('click', startGame);
endButton.addEventListener('click', endGame);
pauseButton.addEventListener('click', togglePause);

document.addEventListener('keydown', (event) => {
    if (!isPaused) {
        if (event.key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -1;
        } else if (event.key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = 1;
        } else if (event.key === 'ArrowLeft' && dx === 0) {
            dx = -1;
            dy = 0;
        } else if (event.key === 'ArrowRight' && dx === 0) {
            dx = 1;
            dy = 0;
        }
    }
});

function startGame() {
    snake = [{x: 10, y: 10}];
    food = generateFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, 100);
}

function endGame() {
    clearInterval(gameLoop);
    alert(`Game Over! Your final score is ${score}`);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        pauseButton.textContent = 'Resume';
    } else {
        gameLoop = setInterval(draw, 100);
        pauseButton.textContent = 'Pause';
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasSize),
        y: Math.floor(Math.random() * canvasSize)
    };
}

function drawSnake() {
    ctx.fillStyle = '#00f';
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
}

function drawFood() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check if the snake ate the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true; // Game over if the snake hits the walls
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Game over if the snake hits itself
        }
    }
    return false;
}

function draw() {
    if (checkCollision()) {
        endGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
}
