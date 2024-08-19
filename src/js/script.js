const rulesBtn = document.getElementById('rules-btn');

const closeBtn = document.getElementById('close-btn');

const rules = document.getElementById('rules');

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

let score = 0;

const bloqueRowCount = 9;

const bloqueColumnCount = 5;


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

const barra = {
    x: canvas.width / 2 -40,
    y: canvas.height -20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// Creamos propiedades de los bloques

const bloquesInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

// Creamos bloques

const bloques = [];
for (let i = 0; i < bloqueRowCount; i++) {
    bloques[i] = [];
    for(let j = 0; j < bloqueColumnCount; j++) {
        const x = i * (bloquesInfo.w + bloquesInfo.padding) + bloquesInfo.offsetX;
        const y = j * (bloquesInfo.h + bloquesInfo.padding) + bloquesInfo.offsetY;
        bloques[i][j] = { x, y, ...bloquesInfo };
    }
}

