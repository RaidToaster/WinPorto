import { createWindow } from '../../core/windowManager.js';

function snakeApp() {
    createWindow("Snake", (contentArea) => {
        contentArea.innerHTML = `
            <div class="game-placeholder">
                <p>Snake Game - Coming Soon!</p>
            </div>
        `;
    }, '../../Windows XP Icons/Games.png');
}

export { snakeApp };