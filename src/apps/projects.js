import { createWindow } from '../core/windowManager.js';

function projectsApp() {
    createWindow("Projects", (ctx, win) => {
        ctx.fillStyle = 'black';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillText("WEEEEEEE", win.x + 10, win.y + 50);
    });
}

export { projectsApp };