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

function createWindow(title, contentCallback) {
    const newWindow = {
        id: nextWindowId++,
        title,
        x: 50 + (windows.length % 10) * 30,
        y: 50 + (windows.length % 10) * 30,
        width: 400,
        height: 300,
        isDragging: false,
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
        // Draw the close icon
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
        const menuX = 0;
        const menuY = canvas.height - 300 - 40;
        if (mouseX > menuX && mouseX < menuX + 200 && mouseY > menuY && mouseY < menuY + 300) {
            const itemIndex = Math.floor((mouseY - menuY) / 30); // 30 is item height
            if (itemIndex >= 0 && itemIndex < menuItems.length) {
                const clickedItem = menuItems[itemIndex];
                // Delegate click handling to startMenu.js
                handleStartMenuClick(event);
                // The toggleStartMenu is already called inside handleStartMenuClick
                return;
            }
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

        // Check if clicking on title bar for dragging or closing
        if (mouseY < clickedWindow.y + TITLE_BAR_HEIGHT) {
            const closeButtonX = clickedWindow.x + clickedWindow.width - 25;
            const closeButtonY = clickedWindow.y + 5;
            if (mouseX > closeButtonX && mouseX < closeButtonX + 20 &&
                mouseY > closeButtonY && mouseY < closeButtonY + 20) {
                const index = windows.indexOf(clickedWindow);
                if (index > -1) {
                    windows.splice(index, 1);
                }
                activeWindow = windows.length > 0 ? windows[windows.length - 1] : null;
            } else {
                // Drag window
                clickedWindow.isDragging = true;
                clickedWindow.dragOffsetX = mouseX - clickedWindow.x;
                clickedWindow.dragOffsetY = mouseY - clickedWindow.y;
            }
        }
    } else {
        if (isMenuOpen) toggleStartMenu();
        activeWindow = null;
    }
}

function handleMouseMove(event) {
    if (activeWindow && activeWindow.isDragging) {
        activeWindow.x = event.clientX - activeWindow.dragOffsetX;
        activeWindow.y = event.clientY - activeWindow.dragOffsetY;
    }
}

function handleMouseUp(event) {
    if (activeWindow) {
        activeWindow.isDragging = false;
    }
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);


function closeAll() {
    windows.length = 0; // Clear the array
    activeWindow = null;
}

export { createWindow, renderWindows, windows, activeWindow, closeAll };