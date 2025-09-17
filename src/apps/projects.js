import { createWindow } from '../core/windowManager.js';

function projectsApp() {
    createWindow("Projects", (contentArea) => {
        contentArea.innerHTML = `<div style="padding: 10px;">Projects content will go here.</div>`;
    }, '../../icons/Briefcase.png');
}

export { projectsApp };