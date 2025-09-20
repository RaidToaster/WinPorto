import { createWindow } from '../core/windowManager.js';
import portfolioData from '../assets/portfolio/portfolioData.js';

function projectsApp() {
    createWindow("Projects", "src/apps/html/projects.html", '../../Windows XP Icons/Briefcase.png');
}

export { projectsApp };