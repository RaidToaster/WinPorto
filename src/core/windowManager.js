// Core Window Manager: Manages all application windows, including their state, position, and rendering order.
import { ctx, canvas } from './canvas.js';
import { toggleStartMenu, isMenuOpen, menuItems, handleStartMenuClick } from './startMenu.js';
import { loadApp } from './appRegistry.js';

const windows = [];
let activeWindow = null;
let nextWindowId = 1;

const TITLE_BAR_HEIGHT = 30;
const BORDER_COLOR = '#0A246A';
const WINDOW_BG_COLOR = '#ECE9D8';
const CORNER_RADIUS = 8;

const closeIcon = new Image();
closeIcon.src = 'Windows XP Icons/Exit.png';

const RESIZE_HANDLE_SIZE = 15;

function createWindow(title, contentCallback) {
    const newWindow = {
        id: nextWindowId++,
        title,
        x: 50 + (windows.length % 10) * 30,
        y: 50 + (windows.length % 10) * 30,
        width: 800,
        height: 600,
        isDragging: false,
        isResizing: false,
        isCloseButtonHovered: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        contentCallback,
    };
    windows.push(newWindow);
    activeWindow = newWindow;
    return newWindow;
}

function renderWindows() {
    windows.forEach(win => {
        // Create a path with rounded top corners
        ctx.beginPath();
        ctx.moveTo(win.x + CORNER_RADIUS, win.y);
        ctx.lineTo(win.x + win.width - CORNER_RADIUS, win.y);
        ctx.quadraticCurveTo(win.x + win.width, win.y, win.x + win.width, win.y + CORNER_RADIUS);
        ctx.lineTo(win.x + win.width, win.y + win.height);
        ctx.lineTo(win.x, win.y + win.height);
        ctx.lineTo(win.x, win.y + CORNER_RADIUS);
        ctx.quadraticCurveTo(win.x, win.y, win.x + CORNER_RADIUS, win.y);
        ctx.closePath();

        // Window Border
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Window Background
        ctx.fillStyle = WINDOW_BG_COLOR;
        ctx.fill();

        // Title Bar
        const titleGradient = ctx.createLinearGradient(win.x, win.y, win.x + win.width, win.y);
        if (win === activeWindow) {
            titleGradient.addColorStop(0, '#0055E7');
            titleGradient.addColorStop(1, '#3B92E5');
        } else {
            titleGradient.addColorStop(0, '#7F9DB9');
            titleGradient.addColorStop(1, '#B0C4DE');
        }
        ctx.fillStyle = titleGradient;
        // We need to clip the title bar to the rounded shape
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(win.x + CORNER_RADIUS, win.y);
        ctx.lineTo(win.x + win.width - CORNER_RADIUS, win.y);
        ctx.quadraticCurveTo(win.x + win.width, win.y, win.x + win.width, win.y + CORNER_RADIUS);
        ctx.lineTo(win.x + win.width, win.y + TITLE_BAR_HEIGHT);
        ctx.lineTo(win.x, win.y + TITLE_BAR_HEIGHT);
        ctx.lineTo(win.x, win.y + CORNER_RADIUS);
        ctx.quadraticCurveTo(win.x, win.y, win.x + CORNER_RADIUS, win.y);
        ctx.closePath();
        ctx.clip();
        ctx.fillRect(win.x, win.y, win.width, TITLE_BAR_HEIGHT);
        ctx.restore();

        // Title Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(win.title, win.x + 10, win.y + TITLE_BAR_HEIGHT / 2);

        // Draw Close Button
        const closeButtonX = win.x + win.width - 25;
        const closeButtonY = win.y + 5;
        const closeButtonSize = 20;

        // Draw Close Button Background (hover effect)
        if (win.isCloseButtonHovered) {
            const closeButtonGradient = ctx.createLinearGradient(closeButtonX, closeButtonY, closeButtonX + closeButtonSize, closeButtonY + closeButtonSize);
            closeButtonGradient.addColorStop(0, '#FF6B6B');
            closeButtonGradient.addColorStop(1, '#E04343');
            ctx.fillStyle = closeButtonGradient;
            ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);
        }

        // Draw Close Button Icon
        if (closeIcon.complete) {
            ctx.drawImage(closeIcon, closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);
        }


        // Render window content
        if (win.contentCallback) {
            ctx.save();
            ctx.rect(win.x + 2, win.y + TITLE_BAR_HEIGHT + 2, win.width - 4, win.height - TITLE_BAR_HEIGHT - 4);
            ctx.clip();
            win.contentCallback(ctx, win);
            ctx.restore();
        }

        // Draw Resize Handle
        const handleX = win.x + win.width - RESIZE_HANDLE_SIZE;
        const handleY = win.y + win.height - RESIZE_HANDLE_SIZE;
        ctx.fillStyle = '#797979ff';
        ctx.beginPath();
        ctx.moveTo(handleX, win.y + win.height);
        ctx.lineTo(win.x + win.width, handleY);
        ctx.lineTo(win.x + win.width, win.y + win.height);
        ctx.closePath();
        ctx.fill();
    });
}

function handleMouseDown(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 1. Check for Start Button click
    if (mouseX < 100 && mouseY > canvas.height - 40) {
        toggleStartMenu();
        return; // Stop further processing
    }

    // 2. Check for Start Menu click
    if (isMenuOpen) {
        console.log('WindowManager: Start menu is open, checking for click within menu bounds.');
        const menuX = 0;
        const menuY = canvas.height - 450 - 30; // MENU_HEIGHT (450) and TASKBAR_HEIGHT (30) from startMenu.js
        const menuWidth = 350; // MENU_WIDTH from startMenu.js
        const menuHeight = 450; // MENU_HEIGHT from startMenu.js

        if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
            mouseY >= menuY && mouseY <= menuY + menuHeight) {
            console.log('WindowManager: Click detected within Start Menu bounds. Delegating to handleStartMenuClick.');
            handleStartMenuClick(event);
            // handleStartMenuClick will close the menu and stop propagation if an item is clicked.
            // If no item is clicked within the menu, the event might still propagate.
            return;
        } else {
            console.log('WindowManager: Click outside Start Menu bounds, but menu is open. Allowing event to propagate to desktop.');
            // Do not return here, let desktop.js handle closing the menu if it's a click outside.
        }
    }

    // 3. Check for window click (from top down)
    let clickedWindow = null;
    for (let i = windows.length - 1; i >= 0; i--) {
        const win = windows[i];
        if (mouseX > win.x && mouseX < win.x + win.width &&
            mouseY > win.y && mouseY < win.y + win.height) {
            clickedWindow = win;
            break;
        }
    }

    if (clickedWindow) {
        // Bring clicked window to front
        const index = windows.indexOf(clickedWindow);
        if (index > -1) {
            windows.splice(index, 1);
            windows.push(clickedWindow);
        }
        activeWindow = clickedWindow;

        const resizeHandleX = clickedWindow.x + clickedWindow.width - RESIZE_HANDLE_SIZE;
        const resizeHandleY = clickedWindow.y + clickedWindow.height - RESIZE_HANDLE_SIZE;

        if (mouseX > resizeHandleX && mouseY > resizeHandleY) {
            clickedWindow.isResizing = true;
        } else if (mouseY < clickedWindow.y + TITLE_BAR_HEIGHT) {
            const closeButtonX = clickedWindow.x + clickedWindow.width - 25;
            const closeButtonY = clickedWindow.y + 5;
            if (mouseX > closeButtonX && mouseX < closeButtonX + 20 &&
                mouseY > closeButtonY && mouseY < closeButtonY + 20) {
                const index = windows.indexOf(clickedWindow);
                if (index > -1) {
                    windows.splice(index, 1);
                }
                activeWindow = windows.length > 0 ? windows[windows.length - 1] : null;
                // Reset hover state for all windows after a close operation
                windows.forEach(win => win.isCloseButtonHovered = false);
            } else {
                clickedWindow.isDragging = true;
                clickedWindow.dragOffsetX = mouseX - clickedWindow.x;
                clickedWindow.dragOffsetY = mouseY - clickedWindow.y;
            }
        }
    } else {
        if (isMenuOpen) toggleStartMenu();
        activeWindow = null;
        // Reset hover state for all windows when clicking outside
        windows.forEach(win => win.isCloseButtonHovered = false);
    }
}

function handleMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    let needsRender = false;
    let cursorStyle = 'default';

    // Check for hover states and set cursor style
    let hoveredWindow = null;
    for (let i = windows.length - 1; i >= 0; i--) {
        const win = windows[i];
        const closeButtonX = win.x + win.width - 25;
        const closeButtonY = win.y + 5;
        const closeButtonSize = 20;

        const isHoveringCloseButton = mouseX > closeButtonX && mouseX < closeButtonX + closeButtonSize &&
            mouseY > closeButtonY && mouseY < closeButtonY + closeButtonSize;

        const resizeHandleX = win.x + win.width - RESIZE_HANDLE_SIZE;
        const resizeHandleY = win.y + win.height - RESIZE_HANDLE_SIZE;

        const isHoveringResizeHandle = mouseX > resizeHandleX && mouseY > resizeHandleY &&
            mouseX < win.x + win.width && mouseY < win.y + win.height;

        if (isHoveringResizeHandle) {
            cursorStyle = 'nwse-resize';
            hoveredWindow = win;
            break;
        } else if (isHoveringCloseButton) {
            cursorStyle = 'pointer';
            hoveredWindow = win;
            break;
        } else if (mouseY < win.y + TITLE_BAR_HEIGHT && mouseX > win.x && mouseX < win.x + win.width &&
            mouseY > win.y) { // Only consider title bar if mouse is within its Y bounds
            cursorStyle = 'grab';
            hoveredWindow = win;
            break;
        }
    }

    // Update isCloseButtonHovered for all windows
    windows.forEach(win => {
        const closeButtonX = win.x + win.width - 25;
        const closeButtonY = win.y + 5;
        const closeButtonSize = 20;
        const isHoveringCloseButton = mouseX > closeButtonX && mouseX < closeButtonX + closeButtonSize &&
            mouseY > closeButtonY && mouseY < closeButtonY + closeButtonSize;

        if (win.isCloseButtonHovered !== isHoveringCloseButton) {
            win.isCloseButtonHovered = isHoveringCloseButton;
            needsRender = true;
        }
    });

    if (activeWindow) {
        if (activeWindow.isDragging) {
            activeWindow.x = mouseX - activeWindow.dragOffsetX;
            activeWindow.y = mouseY - activeWindow.dragOffsetY;
            needsRender = true;
            cursorStyle = 'grabbing';
        } else if (activeWindow.isResizing) {
            const newWidth = mouseX - activeWindow.x;
            const newHeight = mouseY - activeWindow.y;
            activeWindow.width = Math.max(150, newWidth);
            activeWindow.height = Math.max(100, newHeight);
            needsRender = true;
            cursorStyle = 'nwse-resize';
        }
    }

    canvas.style.cursor = cursorStyle;

    if (needsRender) {
        renderWindows();
    }
}

function handleMouseUp(event) {
    if (activeWindow) {
        activeWindow.isDragging = false;
        activeWindow.isResizing = false;
    }
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);


function closeAll() {
    windows.length = 0;
    activeWindow = null;
}

export { createWindow, renderWindows, windows, activeWindow, closeAll };