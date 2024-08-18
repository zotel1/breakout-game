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

const barra = {
    x: canvas.width / 2 -40,
    y: canvas.height -20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};