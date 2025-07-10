import { createWindow } from '../core/windowManager.js';

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function aboutMeApp() {
    createWindow("About Me", (ctx, win) => {
        ctx.fillStyle = 'black';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        const text = "Wow";
        wrapText(ctx, text, win.x + 10, win.y + 50, win.width - 20, 25);
    });
}

export { aboutMeApp };