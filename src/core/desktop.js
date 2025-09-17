import { loadApp } from './appRegistry.js';

const desktopIcons = document.getElementById('desktop-icons');
const icons = [
    { name: 'About Me', app: 'About Me', img: '../../icons/User Accounts.png', x: 30, y: 30 },
    { name: 'Projects', app: 'Projects', img: '../../icons/Briefcase.png', x: 110, y: 30 },
    { name: 'Contact', app: 'Contact', img: '../../icons/Email.png', x: 190, y: 30 },
    { name: 'My Portfolio', app: 'My Portfolio', img: '../../icons/Explorer.png', x: 30, y: 120 },
];

function renderDesktop() {
    desktopIcons.innerHTML = '';

    icons.forEach(iconData => {
        const iconEl = document.createElement('div');
        iconEl.className = 'icon';
        iconEl.style.left = `${iconData.x}px`;
        iconEl.style.top = `${iconData.y}px`;
        iconEl.dataset.index = icons.indexOf(iconData);

        const iconImg = document.createElement('img');
        iconImg.src = iconData.img;
        iconImg.alt = iconData.name;

        const iconLabel = document.createElement('span');
        iconLabel.textContent = iconData.name;

        iconEl.appendChild(iconImg);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        iconEl.appendChild(overlay);

        iconEl.appendChild(iconLabel);

        iconEl.addEventListener('dblclick', () => {
            loadApp(iconData.app);
        });

        iconEl.addEventListener('click', (e) => {
            if (e.detail === 2) return; // Ignore if it's a double-click
            document.querySelectorAll('.icon').forEach(icon => icon.classList.remove('highlighted'));
            iconEl.classList.add('highlighted');
        });

        // Drag functionality
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let startX = 0;
        let startY = 0;

        const startDrag = (e) => {
            if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') return; // Don't drag if clicking on img or label
            isDragging = true;
            const rect = iconEl.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            startX = iconData.x;
            startY = iconData.y;
            iconEl.style.zIndex = '1000';
            iconEl.classList.add('dragging');
            e.preventDefault();
        };

        const drag = (e) => {
            if (!isDragging) return;
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;
            // Clamp to desktop bounds
            const desktopRect = desktopIcons.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, desktopRect.width - 70)); // 70 is icon width
            newY = Math.max(0, Math.min(newY, desktopRect.height - 90)); // 90 for icon height + margin
            iconEl.style.left = `${newX}px`;
            iconEl.style.top = `${newY}px`;
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            iconEl.style.zIndex = '';
            iconEl.classList.remove('dragging');
            // Snap to grid
            const newX = parseFloat(iconEl.style.left);
            const newY = parseFloat(iconEl.style.top);
            const gridX = Math.round((newX - 30) / 80) * 80 + 30;
            const gridY = Math.round((newY - 30) / 90) * 90 + 30;
            // Clamp snapped position
            const maxX = window.innerWidth - 110; // Approximate
            const maxY = window.innerHeight - 150;
            iconData.x = Math.max(30, Math.min(gridX, maxX));
            iconData.y = Math.max(30, Math.min(gridY, maxY));
            iconEl.style.left = `${iconData.x}px`;
            iconEl.style.top = `${iconData.y}px`;
        };

        iconEl.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        desktopIcons.appendChild(iconEl);
    });
}

// Global cleanup for drag listeners if needed, but since per icon, it's fine
document.addEventListener('mousemove', (e) => {
    // Global mousemove handler can be here if needed, but per-icon is okay
});

document.addEventListener('mouseup', (e) => {
    // Global mouseup if needed
});

export { renderDesktop };