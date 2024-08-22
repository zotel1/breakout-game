const startScreen = document.getElementById('start-screen');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const gameOverScreen = document.getElementById('game-over-screen');

let score = 0;
let brickRowCount;
let brickColumnCount;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 2,
    dx: 4,
    dy: -4
};

const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 9,
    dx: 0
};

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

let brick = [];

function createBricks() {
    brick = [];
    for (let i = 0; i < brickRowCount; i++) {
        brick[i] = [];
        for (let j = 0; j < brickColumnCount; j++) {
            const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
            const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
            brick[i][j] = { x, y, ...brickInfo };
        }
    }
}

let animationId;

function update() {
    movePaddle();
    moveBall();

    // Dibujar todo de nuevo
    draw();

    animationId = requestAnimationFrame(update);
}

function checkGameOver() {
    if (ball.y + ball.size > canvas.height) {
        console.log('Game Over');
        cancelAnimationFrame(animationId); // Detener la animación
        showGameOverScreen(); // Mostrar pantalla de Game Over
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con paredes laterales
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Colisión con la parte superior/inferior
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Colisión con la barra
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Colisión con los bloques
    brick.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    // Verificar si el juego ha terminado
    checkGameOver();
}

const startGame = (rowCount, colCount) => {
    if (rowCount && colCount) { // Verificar que se hayan pasado los parámetros de dificultad
        brickRowCount = rowCount;
        brickColumnCount = colCount;
        createBricks();

        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        rules.style.display = 'none'; // Esconder reglas
        rulesBtn.disabled = true; // Deshabilitar botón de reglas
        gameOverScreen.style.display = 'none'; // Esconder pantalla de Game Over

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 4;
        ball.dy = -4;

        update();
    } else {
        alert('Por favor, selecciona una dificultad para comenzar el juego.');
    }
};

const resetGame = () => {
    cancelAnimationFrame(animationId); // Asegurarse de detener cualquier animación en curso
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = canvas.width / 2 - paddle.w / 2;
    createBricks();
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'none'; // Esconder pantalla de Game Over
    rulesBtn.disabled = false; // Habilitar botón de reglas
};

function showGameOverScreen() {
    gameOverScreen.style.display = 'flex';
    canvas.style.display = 'none';
    setTimeout(resetGame, 1500); // Esperar 3 segundos antes de reiniciar el juego
}

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
    rules.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
    rules.style.display = 'none';
});

easyBtn.addEventListener('click', () => startGame(9, 5));
normalBtn.addEventListener('click', () => startGame(9, 7));
hardBtn.addEventListener('click', () => startGame(9, 11));

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
    brick.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#e94905' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

function movePaddle() {
    paddle.x += paddle.dx;

    // Detección de colisión con las paredes
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBrick();
    }
}

function showAllBrick() {
    brick.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

// Soporte táctil
function touchStart(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < canvas.width / 2) {
        paddle.dx = paddle.speed; // Mover a la derecha
    } else {
        paddle.dx = -paddle.speed; // Mover a la izquierda
    }
}

function touchMove(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < canvas.width / 2) {
        paddle.dx = paddle.speed; // Mover a la derecha
    } else {
        paddle.dx = -paddle.speed; // Mover a la izquierda
    }
}

function touchEnd() {
    paddle.dx = 0;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);