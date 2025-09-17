import { ctx, canvas } from './canvas.js';
import { loadApp } from './appRegistry.js';
import { handleTaskbarClick, TASKBAR_HEIGHT, handleTaskbarMouseMove, START_BUTTON_WIDTH } from './taskbar.js';
import { isMenuOpen, handleStartMenuClick, handleStartMenuMouseMove, toggleStartMenu } from './startMenu.js';
import { windows } from './windowManager.js';

const GRID_SIZE_X = 90;
const GRID_SIZE_Y = 90;
const ICON_OFFSET_X = 30;
const ICON_OFFSET_Y = 30;

let isDragging = false;
let draggedIcon = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

const wallpaper = new Image();
let wallpaperLoaded = false;
wallpaper.src = 'src/background.jpg';
wallpaper.onload = () => {
    wallpaperLoaded = true;
};

const icons = [
    { name: 'About Me', app: 'About Me', img: new Image(), x: ICON_OFFSET_X, y: ICON_OFFSET_Y, width: 48, height: 48, isHovered: false, isSelected: false },
    { name: 'Projects', app: 'Projects', img: new Image(), x: ICON_OFFSET_X, y: ICON_OFFSET_Y + GRID_SIZE_Y, width: 48, height: 48, isHovered: false, isSelected: false },
    { name: 'Contact', app: 'Contact', img: new Image(), x: ICON_OFFSET_X, y: ICON_OFFSET_Y + GRID_SIZE_Y * 2, width: 48, height: 48, isHovered: false, isSelected: false },
    { name: 'My Portfolio', app: 'My Portfolio', img: new Image(), x: ICON_OFFSET_X, y: ICON_OFFSET_Y + GRID_SIZE_Y * 3, width: 48, height: 48, isHovered: false, isSelected: false },
];

icons[0].img.src = '../../icons/User Accounts.png';
icons[1].img.src = '../../icons/Briefcase.png';
icons[2].img.src = '../../icons/Email.png';
icons[3].img.src = '../../icons/Explorer.png';

function renderDesktop() {
    if (wallpaperLoaded) {
        ctx.drawImage(wallpaper, 0, 0, canvas.width, canvas.height);
    } else {
        const WALLPAPER_COLOR = '#3A6EA5';
        ctx.fillStyle = WALLPAPER_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render icons
    icons.forEach(icon => {
        if (icon.isHovered || icon.isSelected) {
            ctx.fillStyle = icon.isSelected ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)';
            const highlightSize = icon.width + 40;
            const highlightX = icon.x - 20;
            const highlightY = icon.y - 15;
            ctx.fillRect(highlightX, highlightY, highlightSize, highlightSize);
        }
        ctx.drawImage(icon.img, icon.x, icon.y, icon.width, icon.height);
        ctx.fillStyle = 'white';
        ctx.font = '14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Draw drop shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(icon.name, icon.x + icon.width / 2, icon.y + icon.height + 15);
        ctx.restore();

        // Draw white text
        ctx.fillStyle = 'white';
        ctx.fillText(icon.name, icon.x + icon.width / 2, icon.y + icon.height + 15);

        // Draw thin black stroke for clarity
        ctx.save();
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = 'black';
        ctx.strokeText(icon.name, icon.x + icon.width / 2, icon.y + icon.height + 15);
        ctx.restore();
    });
}

function handleMouseDown(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (isMouseOverWindow(mouseX, mouseY)) {
        return;
    }

    // Check for icon drag start
    icons.forEach(icon => {
        const highlightSize = icon.width + 10;
        const highlightX = icon.x - 5;
        const highlightY = icon.y - 5;
        const highlightHeight = highlightSize + 25;

        if (mouseX > highlightX && mouseX < highlightX + highlightSize &&
            mouseY > highlightY && mouseY < highlightY + highlightHeight) {
            isDragging = true;
            draggedIcon = icon;
            dragOffsetX = mouseX - icon.x;
            dragOffsetY = mouseY - icon.y;
            // Select the icon when dragging starts
            icons.forEach(i => i.isSelected = false);
            icon.isSelected = true;
            renderDesktop();
            canvas.style.cursor = 'grabbing';
        }
    });
}

function handleDesktopClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (isMouseOverWindow(mouseX, mouseY)) {
        return;
    }

    const MENU_WIDTH = 350;
    const MENU_HEIGHT = 450;
    const menuX = 0;
    const menuY = canvas.height - MENU_HEIGHT - TASKBAR_HEIGHT;

    if (isMenuOpen) {
        if (mouseX >= menuX && mouseX <= menuX + MENU_WIDTH &&
            mouseY >= menuY && mouseY <= menuY + MENU_HEIGHT) {
            handleStartMenuClick(event);
        } else {
            // Check if click is on the start button area
            const startButtonX = 0;
            const startButtonY = canvas.height - TASKBAR_HEIGHT;
            const startButtonRight = START_BUTTON_WIDTH;
            const startButtonBottom = canvas.height;

            if (mouseX >= startButtonX && mouseX <= startButtonRight &&
                mouseY >= startButtonY && mouseY <= startButtonBottom) {
                // Clicked on the start button area, do nothing as it's handled by taskbar.js
                console.log('Desktop: Click on start button area, ignoring to prevent menu re-toggle.');
            } else {
                // Click outside menu and not on start button - close it
                console.log('Desktop click outside menu, closing start menu.'); // Debugging log
                toggleStartMenu();
            }
        }
        return;
    }

    // Check if the click is on the taskbar
    if (mouseY > canvas.height - TASKBAR_HEIGHT) {
        handleTaskbarClick(event);
        return;
    }

    // Handle desktop icon single click (only if not dragging)
    if (!isDragging) {
        let clickedOnIcon = false;
        icons.forEach(icon => {
            const highlightSize = icon.width + 10;
            const highlightX = icon.x - 5;
            const highlightY = icon.y - 5;
            const highlightHeight = highlightSize + 25;

            if (mouseX > highlightX && mouseX < highlightX + highlightSize &&
                mouseY > highlightY && mouseY < highlightY + highlightHeight) {
                // Single click on an icon
                icons.forEach(i => i.isSelected = false); // Deselect all
                icon.isSelected = true; // Select clicked icon
                clickedOnIcon = true;
                renderDesktop(); // Re-render to show selection
            }
        });

        if (!clickedOnIcon) {
            // If click is not on an icon, deselect all icons
            let needsRender = false;
            icons.forEach(icon => {
                if (icon.isSelected) {
                    icon.isSelected = false;
                    needsRender = true;
                }
            });
            if (needsRender) {
                renderDesktop();
            }
        }
    }
}

function isMouseOverWindow(mouseX, mouseY) {
    for (let i = windows.length - 1; i >= 0; i--) {
        const win = windows[i];
        if (mouseX > win.x && mouseX < win.x + win.width &&
            mouseY > win.y && mouseY < win.y + win.height) {
            return true;
        }
    }
    return false;
}

function handleDesktopDoubleClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (isMouseOverWindow(mouseX, mouseY)) {
        return;
    }

    icons.forEach(icon => {
        const highlightSize = icon.width + 10;
        const highlightX = icon.x - 5;
        const highlightY = icon.y - 5;
        const highlightHeight = highlightSize + 25;

        if (mouseX > highlightX && mouseX < highlightX + highlightSize &&
            mouseY > highlightY && mouseY < highlightY + highlightHeight) {
            loadApp(icon.app);
        }
    });
}

function handleCanvasMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let needsRender = false;

    if (isDragging && draggedIcon) {
        draggedIcon.x = mouseX - dragOffsetX;
        draggedIcon.y = mouseY - dragOffsetY;
        renderDesktop();
        return;
    }

    if (isMouseOverWindow(mouseX, mouseY)) {
        icons.forEach(icon => {
            if (icon.isHovered) {
                icon.isHovered = false;
                needsRender = true;
            }
        });
        if (needsRender) {
            renderDesktop();
        }
        return;
    }

    if (isMenuOpen) {
        handleStartMenuMouseMove(event);
    } else {
        handleTaskbarMouseMove(event);

        // Check for desktop icon hover
        let hoveredAnIcon = false;
        icons.forEach(icon => {
            const highlightSize = icon.width + 10;
            const highlightX = icon.x - 5;
            const highlightY = icon.y - 5;
            const highlightHeight = highlightSize + 25;

            const isHovering = mouseX > highlightX && mouseX < highlightX + highlightSize &&
                mouseY > highlightY && mouseY < highlightY + highlightHeight;

            if (icon.isHovered !== isHovering) {
                icon.isHovered = isHovering;
                needsRender = true;
            }
            if (isHovering) {
                hoveredAnIcon = true;
            }
        });

        if (needsRender) {
            renderDesktop();
        }
    }
}

function handleMouseUp(event) {
    if (isDragging && draggedIcon) {
        snapToGrid(draggedIcon);
        isDragging = false;
        draggedIcon = null;
        canvas.style.cursor = 'default';
        renderDesktop();
    }
}

function isGridOccupied(x, y, currentIcon) {
    for (const icon of icons) {
        if (icon !== currentIcon && icon.x === x && icon.y === y) {
            return true;
        }
    }
    return false;
}

function snapToGrid(icon) {
    let snappedX = Math.round((icon.x - ICON_OFFSET_X) / GRID_SIZE_X) * GRID_SIZE_X + ICON_OFFSET_X;
    let snappedY = Math.round((icon.y - ICON_OFFSET_Y) / GRID_SIZE_Y) * GRID_SIZE_Y + ICON_OFFSET_Y;

    if (isGridOccupied(snappedX, snappedY, icon)) {
        let foundSlot = false;
        for (let col = 0; col < canvas.width / GRID_SIZE_X; col++) {
            for (let row = 0; row < (canvas.height - TASKBAR_HEIGHT) / GRID_SIZE_Y; row++) {
                const potentialX = col * GRID_SIZE_X + ICON_OFFSET_X;
                const potentialY = row * GRID_SIZE_Y + ICON_OFFSET_Y;

                if (!isGridOccupied(potentialX, potentialY, icon)) {
                    snappedX = potentialX;
                    snappedY = potentialY;
                    foundSlot = true;
                    break;
                }
            }
            if (foundSlot) break;
        }
    }

    icon.x = snappedX;
    icon.y = snappedY;
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('click', handleDesktopClick);
canvas.addEventListener('dblclick', handleDesktopDoubleClick);
canvas.addEventListener('mousemove', handleCanvasMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);


export { renderDesktop };