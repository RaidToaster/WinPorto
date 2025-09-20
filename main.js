import { createWindow } from './src/core/windowManager.js';
import { registerApp, loadApp } from './src/core/appRegistry.js';
import { projectsApp } from './src/apps/projects.js';
import { contactApp } from './src/apps/contact.js';
import { explorerApp } from './src/apps/explorer.js';
import { aboutMeApp } from './src/apps/aboutMe.js';
import { startupApp } from './src/apps/startup.js';
import { pongApp } from './src/apps/games/pong.js';
import { snakeApp } from './src/apps/games/snake.js';
import { paintApp } from './src/apps/paint.js';
import { cvApp } from './src/apps/cv.js';
import { renderTaskbar } from './src/core/taskbar.js';
import { renderDesktop } from './src/core/desktop.js';
import { toggleStartMenu } from './src/core/startMenu.js';

function main() {
    console.log("Portfolio OS Initializing...");

    registerApp("Projects", null, projectsApp);
    registerApp("Contact", null, contactApp);
    registerApp('Explorer', null, explorerApp);
    registerApp('About Me', null, aboutMeApp);
    registerApp("Pong", null, pongApp);
    registerApp("Snake", null, snakeApp);
    registerApp("Paint", null, paintApp);
    registerApp("CV", null, cvApp);

    renderDesktop();
    renderTaskbar();

    startupApp();
}

main();