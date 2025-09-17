import { createWindow } from './src/core/windowManager.js';
import { registerApp, loadApp } from './src/core/appRegistry.js';
import { aboutMeApp } from './src/apps/aboutMe.js';
import { projectsApp } from './src/apps/projects.js';
import { contactApp } from './src/apps/contact.js';
import { explorerApp } from './src/apps/explorer.js'; // Import the new explorerApp function
import { renderTaskbar } from './src/core/taskbar.js';
import { renderDesktop } from './src/core/desktop.js';
import { toggleStartMenu } from './src/core/startMenu.js';

function main() {
    console.log("Portfolio OS Initializing...");

    registerApp("About Me", null, aboutMeApp);
    registerApp("Projects", null, projectsApp);
    registerApp("Contact", null, contactApp);
    registerApp('My Portfolio', null, explorerApp);

    loadApp("About Me");

    renderDesktop();
    renderTaskbar();
}

main();