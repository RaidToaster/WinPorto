import { createWindow } from '../core/windowManager.js';
import portfolioData from '../assets/portfolio/portfolioData.js';

function projectsApp() {
    createWindow("Projects", (contentArea) => {
        const projects = portfolioData.categories.find(c => c.id === 'projects').files;
        let projectsHtml = '<ul>';
        projects.forEach(project => {
            projectsHtml += `<li><h3>${project.name}</h3><p>${project.description}</p></li>`;
        });
        projectsHtml += '</ul>';
        contentArea.innerHTML = `<div class="padded-content">${projectsHtml}</div>`;
    }, '../../icons/Briefcase.png');
}

export { projectsApp };