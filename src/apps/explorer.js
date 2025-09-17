import { createWindow } from '../core/windowManager.js';
import portfolioData from '../assets/portfolio/portfolioData.js';

function getIconForFileType(type) {
    switch (type) {
        case 'pdf':
            return '../../Windows XP Icons/Adobe Acrobat Reader 7.0.png';
        case 'docx':
            return '../../Windows XP Icons/Microsoft Office Word 2003.png';
        case 'png':
        case 'jpg':
            return '../../Windows XP Icons/Microsoft Office Picture Manager.png';
        default:
            return '../../Windows XP Icons/Generic Document.png';
    }
}

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
            categoryItem.addEventListener('click', () => {
                mainContent.innerHTML = '';
                const selectedCategory = portfolioData.categories.find(c => c.id === category.id);
                if (selectedCategory) {
                    selectedCategory.files.forEach(file => {
                        const fileEl = document.createElement('div');
                        fileEl.className = 'file-item';
                        fileEl.innerHTML = `<img src="${getIconForFileType(file.type)}" alt="${file.name}"><span>${file.name}</span>`;
                        mainContent.appendChild(fileEl);
                    });
                }
            });
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