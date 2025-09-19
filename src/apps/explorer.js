import { createWindow } from '../core/windowManager.js';

function explorerApp() {
    createWindow("Explorer", "src/apps/html/explorer.html", '../../Windows XP Icons/My Computer.png');
}

export { explorerApp };