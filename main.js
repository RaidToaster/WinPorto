import { initCanvas, ctx, canvas } from './src/core/canvas.js';
import { renderDesktop } from './src/core/desktop.js';
import { renderTaskbar } from './src/core/taskbar.js';
import { createWindow, renderWindows } from './src/core/windowManager.js';
import { renderStartMenu } from './src/core/startMenu.js';
import { registerApp, loadApp } from './src/core/appRegistry.js';
import { aboutMeApp } from './src/apps/aboutMe.js';
import { projectsApp } from './src/apps/projects.js';
import { contactApp } from './src/apps/contact.js';
import { explorerApp } from './src/apps/explorer.js'; // Import the new explorerApp function

function main() {
    console.log("Portfolio OS Initializing...");
    initCanvas();

    registerApp("About Me", null, aboutMeApp);
    registerApp("Projects", null, projectsApp);
    registerApp("Contact", null, contactApp);
    registerApp('My Portfolio', null, explorerApp); 

    loadApp("About Me");

    // Main render loop
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderDesktop();
        renderWindows();
        renderTaskbar();
        renderStartMenu();
        requestAnimationFrame(render);
    }

    render();
}

main();