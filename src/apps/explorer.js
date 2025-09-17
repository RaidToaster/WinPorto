import { createWindow } from '../core/windowManager.js';
import portfolioData from '../assets/portfolio/portfolioData.js';

function explorerApp() {
    createWindow("My Portfolio", (contentArea) => {
        const explorerEl = document.createElement('div');
        explorerEl.className = 'explorer';

        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.innerHTML = `
            <span>Back</span>
            <span>Up</span>
            <span>Path: My Portfolio</span>
        `;

        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        mainContent.innerHTML = '<p>Select a category to view files.</p>';

        const categoriesList = document.createElement('ul');
        portfolioData.categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.textContent = category.name;
            categoriesList.appendChild(categoryItem);
        });

        sidebar.appendChild(categoriesList);
        explorerEl.appendChild(toolbar);
        explorerEl.appendChild(sidebar);
        explorerEl.appendChild(mainContent);
        contentArea.appendChild(explorerEl);

    }, '../../icons/Explorer.png');
}

export { explorerApp };