import { createWindow } from './src/core/windowManager.js';
import { registerApp, loadApp } from './src/core/appRegistry.js';
import { aboutMeApp } from './src/apps/aboutMe.js';
import { projectsApp } from './src/apps/projects.js';
import { contactApp } from './src/apps/contact.js';
import { explorerApp } from './src/apps/explorer.js';
import { pongApp } from './src/apps/games/pong.js';
import { snakeApp } from './src/apps/games/snake.js';
import { renderTaskbar } from './src/core/taskbar.js';
import { renderDesktop } from './src/core/desktop.js';
import { toggleStartMenu } from './src/core/startMenu.js';

function main() {
    console.log("Portfolio OS Initializing...");

    registerApp("About Me", null, aboutMeApp);
    registerApp("Projects", null, projectsApp);
    registerApp("Contact", null, contactApp);
    registerApp('Explorer', null, explorerApp);
    registerApp("Pong", null, pongApp);
    registerApp("Snake", null, snakeApp);

    loadApp("About Me");

    renderDesktop();
    renderTaskbar();
}

main();