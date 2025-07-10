const canvas = document.getElementById('desktopCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

export { ctx, canvas, initCanvas };