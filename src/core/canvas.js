const canvas = document.getElementById('desktopCanvas');
const ctx = canvas.getContext('2d');

function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderDynamicText();
}

function renderDynamicText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';

    const text = "This is a sample text";
    const maxWidth = canvas.width * 0.8;
    const lineHeight = 20;
    const startX = canvas.width * 0.1;
    const startY = 50;

    wrapText(text, startX, startY, maxWidth, lineHeight);
}

function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

export { ctx, canvas, initCanvas, renderDynamicText, wrapText };