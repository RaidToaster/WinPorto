import { createWindow } from '../core/windowManager.js';
import { wrapText } from '../core/canvas.js';

function aboutMeApp() {
    createWindow("About Me", (ctx, win) => {
        ctx.fillStyle = 'black';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        const text = "Hello! I'm a passionate software developer with expertise in creating interactive web experiences. My skills include JavaScript, HTML5 Canvas, and responsive UI design. I enjoy solving complex problems and building applications that delight users. When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.";
        wrapText(text, win.x + 10, win.y + 50, win.width - 20, 25);
    }, '../../icons/User Accounts.png');
}

export { aboutMeApp };