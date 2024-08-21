const startScreen = document.getElementById('start-screen');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

function startGame(rowCount, colCount) {
    brickRowCount = rowCount;
    brickColumnCount = colCount;
    createBricks();

    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('rules').style.display = 'block';

    update();
}

easyBtn.addEventListener('click', () => startGame(9, 5));
normalBtn.addEventListener('click', () => startGame(9, 7));
hardBtn.addEventListener('click', () => startGame(9, 11));

// Econst rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');


// Crear bloques

for (let i = 0; i < brickRowCount; i++) {
    brick[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        brick[i][j] = { x, y, ...brickInfo };
    }
}

// Dibujar pelota en el canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#b100dd';
    ctx.fill();
    ctx.closePath();
}

// Dibujar barra en el canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#b100dd';
    ctx.fill();
    ctx.closePath();
}

// Dibujar puntaje en el canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Dibujar bloques en el canvas
function drawBricks() {
    brick.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#b100dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

// Mover la paleta sobre la pantalla
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

// Mover la pelota en el lienzo
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con paredes laterales
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Colisión con la parte superior/inferior
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
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
                    ball.x - ball.size > brick.x && // Verificación lado izquierdo del bloque
                    ball.x + ball.size < brick.x + brick.w && // Verificación lado derecho del bloque
                    ball.y + ball.size > brick.y && // Verificación lado superior del bloque
                    ball.y - ball.size < brick.y + brick.h // Verificación lado inferior del bloque
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    // Pérdida de la bola al tocar el fondo
    if (ball.y + ball.size > canvas.height) {
        showAllBrick();
        score = 0;
    }
}

// Aumentar puntaje
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBrick();
    }
}

// Mostrar todos los bloques
function showAllBrick() {
    brick.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

// Dibujar todo
function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

// Actualizar el canvas y la animación
function update() {
    movePaddle();
    moveBall();

    // Dibujar todo
    draw();

    requestAnimationFrame(update);
}

update();

// Eventos de teclado
function handleKeydown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function handleKeyup(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

// Asignar eventos de teclado
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// Asignar eventos para reglas y cerrar
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));