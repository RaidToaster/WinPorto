import { createWindow } from '../../core/windowManager.js';

function pongApp() {
    createWindow("Pong", (contentArea) => {
        contentArea.innerHTML = `
            <div class="game-placeholder">
                <p>Pong Game - Coming Soon!</p>
            </div>
        `;
    }, '../../Windows XP Icons/Games.png');
}

export { pongApp };