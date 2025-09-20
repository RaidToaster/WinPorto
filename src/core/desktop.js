import { loadApp } from './appRegistry.js';
import { setActiveWindow } from './windowManager.js';
import { isMenuOpen, toggleStartMenu } from './startMenu.js';

const desktopIcons = document.getElementById('desktop-icons');
const icons = [
    { name: 'About Me', app: 'About Me', img: '../../Windows XP Icons/User Accounts.png', x: -50, y: 30 },
    { name: 'Projects', app: 'Projects', img: '../../Windows XP Icons/Briefcase.png', x: -50, y: 120 },
    { name: 'Contact', app: 'Contact', img: '../../Windows XP Icons/Email.png', x: -50, y: 210 },
    { name: 'Explorer', app: 'Explorer', img: '../../Windows XP Icons/Explorer.png', x: -50, y: 300 },
    { name: 'Paint', app: 'Paint', img: '../../Windows XP Icons/Paint.png', x: 29, y: 120 },
    { name: 'CV', app: 'CV', img: '../../Windows XP Icons/Generic Text Document.png', x: 29, y: 30 }
];

function isPositionOccupied(x, y, currentIconIndex) {
    return icons.some((icon, index) => {
        if (index === currentIconIndex) {
            return false;
        }
        return icon.x === x && icon.y === y;
    });
}

function findNextAvailablePosition(x, y) {
    let newX = x;
    let newY = y;
    const gridStepX = 80;
    const gridStepY = 90;
    const desktopRect = desktopIcons.getBoundingClientRect();

    while (isPositionOccupied(newX, newY, -1)) {
        newX += gridStepX;
        if (newX + 70 > desktopRect.width) {
            newX = 30;
            newY += gridStepY;
        }
        if (newY + 90 > desktopRect.height) {
            return { x, y };
        }
    }
    return { x: newX, y: newY };
}

function renderDesktop() {
    desktopIcons.innerHTML = '';

    icons.forEach(iconData => {
        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon';

        // Ensure initial positions are not overlapping
        const availablePosition = findNextAvailablePosition(iconData.x, iconData.y);
        iconData.x = availablePosition.x;
        iconData.y = availablePosition.y;

        iconEl.style.left = `${iconData.x}px`;
        iconEl.style.top = `${iconData.y}px`;
        const iconIndex = icons.indexOf(iconData);
        iconEl.dataset.index = iconIndex;

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
            document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
            iconEl.classList.add('selected');
        });

        // Drag functionality
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const startDrag = (e) => {
            if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') return; // Don't drag if clicking on img or label
            isDragging = true;
            const rect = iconEl.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
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

            const newX = parseFloat(iconEl.style.left);
            const newY = parseFloat(iconEl.style.top);

            let gridX = Math.round((newX - 30) / 80) * 80 + 30;
            let gridY = Math.round((newY - 30) / 90) * 90 + 30;

            const maxX = window.innerWidth - 110; // Approximate
            const maxY = window.innerHeight - 150;
            gridX = Math.max(30, Math.min(gridX, maxX));
            gridY = Math.max(30, Math.min(gridY, maxY));

            if (isPositionOccupied(gridX, gridY, iconIndex)) {
                const nextPos = findNextAvailablePosition(gridX, gridY);
                gridX = nextPos.x;
                gridY = nextPos.y;
            }

            iconData.x = gridX;
            iconData.y = gridY;

            iconEl.style.left = `${iconData.x}px`;
            iconEl.style.top = `${iconData.y}px`;
        };

        iconEl.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        desktopIcons.appendChild(iconEl);
    });
}

desktopIcons.addEventListener('click', (e) => {
    if (e.target === desktopIcons) {
        // Deactivate any active window
        setActiveWindow(null);

        // Deselect any highlighted icon
        document.querySelectorAll('.desktop-icon.selected').forEach(icon => {
            icon.classList.remove('selected');
        });

        // Close start menu if it's open
        if (isMenuOpen) {
            toggleStartMenu();
        }
    }
});

// Global cleanup for drag listeners if needed, but since per icon, it's fine
document.addEventListener('mousemove', (e) => {
    // Global mousemove handler can be here if needed, but per-icon is okay
});

document.addEventListener('mouseup', (e) => {
    // Global mouseup if needed
});

export { renderDesktop };