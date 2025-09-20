import { createWindow } from '../core/windowManager.js';

function paintApp() {
    createWindow("Paint", "src/apps/html/paint.html", '../../Windows XP Icons/Paint.png');
}

export { paintApp };