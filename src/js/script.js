const rulesBtn = document.getElementById('rules-btn');

const closeBtn = document.getElementById('close-btn');

const rules = document.getElementById('rules');

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;

const brickColumnCount = 5;


// Creamos la propiedades de la pelota

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

// Creamos las propiedades de la barra

const paddle = {
    x: canvas.width / 2 -40,
    y: canvas.height -20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// Creamos propiedades de los bloques

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

// Creamos brick


const brick = [];
for (let i = 0; i < brickRowCount; i++) {
    brick[i] = [];
    for(let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        brick[i][j] = { x, y, ...brickInfo };
    }
}

// Draw ball on canvas

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#b100dd';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#b100dd';
    ctx.fill();
    ctx.closePath();
}

//Draw score on canvas

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
    brick.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#b100dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })

}

// Mover la paleta sobre la pantalla
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if(paddle.x +paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0) {
        paddle.x  = 0;
    }
}

// Mover la pelota en el lienso

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (right/left)

if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0 ) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
}

// Wall collision(top/bottom)
if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
}

// Colision de la paleta
if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
) {
    ball.dy = -ball.speed;
}

// Colision de bloques
brick.forEach(column => {
    column.forEach(brick => {
        if(brick.visible) {
            if(
                ball.x - ball.size > brick.x && // Left bloques side check
                ball.x + ball.size < brick.x + brick.w && // derecha bloques side check
                ball.y + ball.size > brick.y && // top bloques sude check
                ball.y - ball.size < brick.y + brick.h // Bottom bloques side check
            ) {
                ball.dy *= -1;
                brickColumnCount.visible = false;

                increaseScore();
            }
        }
    });
});

// Hit bottom wall -lose
if(ball.y + ball.size > canvas.height) {
    showAllBrick();
    score = 0;
}
}
// increase Score
function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) === 0) {
        showAllBrick();
    }
}

// Make all bloques appear
function showAllBrick() {
    brick.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

// Draw everything
function draw() {
    // Clear canvas

    ctx.clearRect(0,0,canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//Update canvas drawing and animation

function update() {
    movePaddle();
    moveBall();

    // draw everithing
    draw();

    requestAnimationFrame(update);
}

update();

//Keydown event

function Keydown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

// Keyup evant
function Keyup(e) {
    if(
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

// Keyboard evant handlers
document.addEventListener('keydown', Keydown);
document.addEventListener('keyup', Keyup);

// Rules and close  event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

