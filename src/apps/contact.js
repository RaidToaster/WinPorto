import { createWindow } from '../core/windowManager.js';

function contactApp() {
    createWindow("Contact", (ctx, win) => {
        ctx.fillStyle = 'black';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillText("Woowee", win.x + 10, win.y + 50);
    }, '../../icons/Email.png');
}

export { contactApp };