import { loadApp } from './appRegistry.js';

const desktop = document.getElementById('desktop');
const icons = [
    { name: 'About Me', app: 'About Me', img: '../../icons/User Accounts.png' },
    { name: 'Projects', app: 'Projects', img: '../../icons/Briefcase.png' },
    { name: 'Contact', app: 'Contact', img: '../../icons/Email.png' },
    { name: 'My Portfolio', app: 'My Portfolio', img: '../../icons/Explorer.png' },
];

function renderDesktop() {
    desktop.innerHTML = ''; // Clear existing icons

    icons.forEach(iconData => {
        const iconEl = document.createElement('div');
        iconEl.className = 'icon';
        iconEl.style.left = '30px'; // Initial position
        iconEl.style.top = `${30 + icons.indexOf(iconData) * 90}px`; // Staggered position

        const iconImg = document.createElement('img');
        iconImg.src = iconData.img;
        iconImg.alt = iconData.name;

        const iconLabel = document.createElement('span');
        iconLabel.textContent = iconData.name;

        iconEl.appendChild(iconImg);
        iconEl.appendChild(iconLabel);
        
        iconEl.addEventListener('dblclick', () => {
            loadApp(iconData.app);
        });

        desktop.appendChild(iconEl);
    });
}

export { renderDesktop };