// Core Window Manager: Manages all application windows, including their state, position, and rendering order.
import { ctx, canvas } from './canvas.js';
import { toggleStartMenu, isMenuOpen, menuItems, handleStartMenuClick } from './startMenu.js';
import { loadApp } from './appRegistry.js';

const windows = [];
const taskbarOrderWindows = [];
let activeWindow = null;
let nextWindowId = 1;

const TITLE_BAR_HEIGHT = 30;
const BORDER_COLOR = '#0831d9';
const WINDOW_BG_COLOR = '#ECE9D8';
const CORNER_RADIUS = 8;

const closeIcon = new Image();
closeIcon.src = 'Windows XP Icons/Exit.png';
const minimizeIcon = new Image();
minimizeIcon.src = 'Windows XP Icons/Minimize.png';
const maximizeIcon = new Image();
maximizeIcon.src = 'Windows XP Icons/Maximize.png';

const RESIZE_HANDLE_SIZE = 15;

const buttonSize = 20;
const buttonSpacing = 3;

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
        minimized: false,
        isMinimizeButtonHovered: false,
        isMaximizeButtonHovered: false,
        maximized: false,
    };
    windows.push(newWindow);
    taskbarOrderWindows.push(newWindow);
    activeWindow = newWindow;
    return newWindow;
}

function renderWindows() {
    windows.forEach(win => {
        if (win.minimized) {
            return;
        }
        // Create a path with rounded top corners
        ctx.beginPath();
        ctx.roundRect(win.x, win.y, win.width, win.height, [CORNER_RADIUS, CORNER_RADIUS, 0, 0]);
        ctx.closePath();

        // Window Border
        ctx.strokeStyle = win === activeWindow ? BORDER_COLOR : '#abbae3';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Window Background
        ctx.fillStyle = WINDOW_BG_COLOR;
        ctx.fill();

        // Title Bar
        const titleGradient = ctx.createLinearGradient(win.x, win.y, win.x, win.y + TITLE_BAR_HEIGHT);
        if (win === activeWindow) {
            titleGradient.addColorStop(0, 'rgb(0, 88, 238)');
            titleGradient.addColorStop(0.04, 'rgb(53, 147, 255)');
            titleGradient.addColorStop(0.06, 'rgb(40, 142, 255)');
            titleGradient.addColorStop(0.08, 'rgb(18, 125, 255)');
            titleGradient.addColorStop(0.10, 'rgb(3, 111, 252)');
            titleGradient.addColorStop(0.14, 'rgb(2, 98, 238)');
            titleGradient.addColorStop(0.20, 'rgb(0, 87, 229)');
            titleGradient.addColorStop(0.24, 'rgb(0, 84, 227)');
            titleGradient.addColorStop(0.56, 'rgb(0, 85, 235)');
            titleGradient.addColorStop(0.66, 'rgb(0, 91, 245)');
            titleGradient.addColorStop(0.76, 'rgb(2, 106, 254)');
            titleGradient.addColorStop(0.86, 'rgb(0, 98, 239)');
            titleGradient.addColorStop(0.92, 'rgb(0, 82, 214)');
            titleGradient.addColorStop(0.94, 'rgb(0, 64, 171)');
            titleGradient.addColorStop(1.00, 'rgb(0, 48, 146)');
        } else {
            titleGradient.addColorStop(0, 'rgb(118, 151, 231)');
            titleGradient.addColorStop(0.03, 'rgb(126, 158, 227)');
            titleGradient.addColorStop(0.06, 'rgb(148, 175, 232)');
            titleGradient.addColorStop(0.08, 'rgb(151, 180, 233)');
            titleGradient.addColorStop(0.14, 'rgb(130, 165, 228)');
            titleGradient.addColorStop(0.17, 'rgb(124, 159, 226)');
            titleGradient.addColorStop(0.25, 'rgb(121, 150, 222)');
            titleGradient.addColorStop(0.56, 'rgb(123, 153, 225)');
            titleGradient.addColorStop(0.81, 'rgb(130, 169, 233)');
            titleGradient.addColorStop(0.89, 'rgb(128, 165, 231)');
            titleGradient.addColorStop(0.94, 'rgb(123, 150, 225)');
            titleGradient.addColorStop(0.97, 'rgb(122, 147, 223)');
            titleGradient.addColorStop(1.00, 'rgb(171, 186, 227)');
        }
        ctx.fillStyle = titleGradient;
        // We need to clip the title bar to the rounded shape
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(win.x, win.y, win.width, TITLE_BAR_HEIGHT, [CORNER_RADIUS, CORNER_RADIUS, 0, 0]);
        ctx.closePath();
        ctx.clip();
        ctx.fillRect(win.x, win.y, win.width, TITLE_BAR_HEIGHT);
        ctx.restore();

        // Slight White Top Edge thats in windows XP apparently
        // ctx.strokeStyle = '#FFFFFF';
        // ctx.lineWidth = 0.5;
        // ctx.beginPath();
        // ctx.moveTo(win.x, win.y + CORNER_RADIUS);
        // ctx.arcTo(win.x, win.y, win.x + CORNER_RADIUS, win.y, CORNER_RADIUS);
        // ctx.lineTo(win.x + win.width - CORNER_RADIUS, win.y);
        // ctx.arcTo(win.x + win.width, win.y, win.x + win.width, win.y + CORNER_RADIUS, CORNER_RADIUS);
        // ctx.stroke();

        // Title Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(win.title, win.x + 10, win.y + TITLE_BAR_HEIGHT / 2);

        // Draw Title Bar Buttons (minimize, maximize, close)
        const buttonY = win.y + (TITLE_BAR_HEIGHT - buttonSize) / 2;

        // Minimize button (leftmost)
        const minimizeButtonX = win.x + win.width - 25 - buttonSize * 2 - buttonSpacing * 2;
        ctx.fillStyle = win.isMinimizeButtonHovered ? 'rgba(255,255,255,0.2)' : 'transparent';
        ctx.fillRect(minimizeButtonX, buttonY, buttonSize, buttonSize);
        if (minimizeIcon.complete) {
            ctx.drawImage(minimizeIcon, minimizeButtonX, buttonY, buttonSize, buttonSize);
        }

        // Create white overlay when hovering over minimize button
        ctx.fillStyle = win.isMinimizeButtonHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
        ctx.fillRect(minimizeButtonX, buttonY, buttonSize, buttonSize);

        // Maximize button (middle)
        const maximizeButtonX = minimizeButtonX + buttonSize + buttonSpacing;
        ctx.fillStyle = win.isMaximizeButtonHovered ? 'rgba(255,255,255,0.2)' : 'transparent';
        ctx.fillRect(maximizeButtonX, buttonY, buttonSize, buttonSize);
        if (maximizeIcon.complete) {
            ctx.drawImage(maximizeIcon, maximizeButtonX, buttonY, buttonSize, buttonSize);
        }

        // Create white overlay when hovering over maximize button
        ctx.fillStyle = win.isMaximizeButtonHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
        ctx.fillRect(maximizeButtonX, buttonY, buttonSize, buttonSize);

        // Close button (rightmost)
        const closeButtonX = maximizeButtonX + buttonSize + buttonSpacing;
        ctx.fillStyle = win.isCloseButtonHovered ? 'rgba(255,255,255,0.2)' : 'transparent';
        ctx.fillRect(closeButtonX, buttonY, buttonSize, buttonSize);
        if (closeIcon.complete) {
            ctx.drawImage(closeIcon, closeButtonX, buttonY, buttonSize, buttonSize);
        }

        // Create white overlay when hovering over close button
        ctx.fillStyle = win.isCloseButtonHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
        ctx.fillRect(closeButtonX, buttonY, buttonSize, buttonSize);

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
        const menuY = canvas.height - 450 - 30;
        const menuWidth = 350; // MENU_WIDTH from startMenu.js
        const menuHeight = 450; // MENU_HEIGHT from startMenu.js

        if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
            mouseY >= menuY && mouseY <= menuY + menuHeight) {
            console.log('WindowManager: Click detected within Start Menu bounds. Delegating to handleStartMenuClick.');
            handleStartMenuClick(event);
            return;
        } else {
            console.log('WindowManager: Click outside Start Menu bounds, but menu is open. Allowing event to propagate to desktop.');
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
            const buttonSize = 20;
            const buttonSpacing = 5;
            const buttonY = clickedWindow.y + (TITLE_BAR_HEIGHT - buttonSize) / 2;

            // Close button (rightmost)
            const closeButtonX = clickedWindow.x + clickedWindow.width - buttonSize - 8;
            const isHoveringCloseButton = mouseX >= closeButtonX && mouseX < closeButtonX + buttonSize &&
                mouseY >= buttonY && mouseY < buttonY + buttonSize;

            // Maximize button (middle)
            const maximizeButtonX = closeButtonX - buttonSize - buttonSpacing;
            const isHoveringMaximizeButton = mouseX >= maximizeButtonX && mouseX < maximizeButtonX + buttonSize &&
                mouseY >= buttonY && mouseY < buttonY + buttonSize;

            // Minimize button (leftmost)
            const minimizeButtonX = maximizeButtonX - buttonSize - buttonSpacing;
            const isHoveringMinimizeButton = mouseX >= minimizeButtonX && mouseX < minimizeButtonX + buttonSize &&
                mouseY >= buttonY && mouseY < buttonY + buttonSize;

            if (isHoveringCloseButton) {
                // Close window
                const index = windows.indexOf(clickedWindow);
                if (index > -1) {
                    windows.splice(index, 1);
                }
                const taskbarIndex = taskbarOrderWindows.findIndex(w => w.id === clickedWindow.id);
                if (taskbarIndex > -1) {
                    taskbarOrderWindows.splice(taskbarIndex, 1);
                }
                activeWindow = windows.length > 0 ? windows[windows.length - 1] : null;
            } else if (isHoveringMinimizeButton) {
                // Minimize window
                clickedWindow.minimized = true;
                if (activeWindow === clickedWindow) {
                    activeWindow = windows.length > 1 ? windows[windows.length - 2] : null;
                }
            } else if (isHoveringMaximizeButton) {
                // Maximize/restore window
                if (clickedWindow.maximized) {
                    // Restore window
                    clickedWindow.x = clickedWindow.preMaximizeState.x;
                    clickedWindow.y = clickedWindow.preMaximizeState.y;
                    clickedWindow.width = clickedWindow.preMaximizeState.width;
                    clickedWindow.height = clickedWindow.preMaximizeState.height;
                    clickedWindow.maximized = false;
                } else {
                    clickedWindow.preMaximizeState = {
                        x: clickedWindow.x,
                        y: clickedWindow.y,
                        width: clickedWindow.width,
                        height: clickedWindow.height
                    };
                    clickedWindow.x = 0;
                    clickedWindow.y = 0;
                    clickedWindow.width = canvas.width;
                    clickedWindow.height = canvas.height - 30;
                    clickedWindow.maximized = true;
                }
            } else {
                clickedWindow.isDragging = true;
                clickedWindow.dragOffsetX = mouseX - clickedWindow.x;
                clickedWindow.dragOffsetY = mouseY - clickedWindow.y;
            }
        }
    } else {
        if (isMenuOpen) toggleStartMenu();
        activeWindow = null;
        windows.forEach(win => win.isCloseButtonHovered = false);
    }
}

function handleMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    let needsRender = false;
    let cursorStyle = 'default';

    let hoveredWindow = null;
    for (let i = windows.length - 1; i >= 0; i--) {
        const win = windows[i];
        const buttonY = win.y + (TITLE_BAR_HEIGHT - buttonSize) / 2;

        // Close button (rightmost)
        const closeButtonX = win.x + win.width - buttonSize - 8;
        const isHoveringCloseButton = mouseX >= closeButtonX && mouseX < closeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        // Maximize button (middle)
        const maximizeButtonX = closeButtonX - buttonSize - buttonSpacing;
        const isHoveringMaximizeButton = mouseX >= maximizeButtonX && mouseX < maximizeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        // Minimize button (leftmost)
        const minimizeButtonX = maximizeButtonX - buttonSize - buttonSpacing;
        const isHoveringMinimizeButton = mouseX >= minimizeButtonX && mouseX < minimizeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        const resizeHandleX = win.x + win.width - RESIZE_HANDLE_SIZE;
        const resizeHandleY = win.y + win.height - RESIZE_HANDLE_SIZE;

        const isHoveringResizeHandle = mouseX > resizeHandleX && mouseY > resizeHandleY &&
            mouseX < win.x + win.width && mouseY < win.y + win.height;

        if (isHoveringResizeHandle) {
            cursorStyle = 'nwse-resize';
            hoveredWindow = win;
            break;
        } else if (isHoveringCloseButton || isHoveringMaximizeButton || isHoveringMinimizeButton) {
            console.log('WindowManager: Hovering over a window button.');
            cursorStyle = 'pointer';
            hoveredWindow = win;
            break;
        } else if (mouseY < win.y + TITLE_BAR_HEIGHT && mouseX > win.x && mouseX < win.x + win.width - buttonSize * 3 - buttonSpacing * 3 &&
            mouseY > win.y) {
            cursorStyle = 'grab';
            hoveredWindow = win;
            break;
        }
    }

    // Update isCloseButtonHovered for all windows
    windows.forEach(win => {
        const buttonSize = 20;
        const buttonSpacing = 5;
        const buttonY = win.y + (TITLE_BAR_HEIGHT - buttonSize) / 2;

        // Close button (rightmost)
        const closeButtonX = win.x + win.width - buttonSize - 8;
        const isHoveringCloseButton = mouseX >= closeButtonX && mouseX < closeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        // Maximize button (middle)
        const maximizeButtonX = closeButtonX - buttonSize - buttonSpacing;
        const isHoveringMaximizeButton = mouseX >= maximizeButtonX && mouseX < maximizeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        // Minimize button (leftmost)
        const minimizeButtonX = maximizeButtonX - buttonSize - buttonSpacing;
        const isHoveringMinimizeButton = mouseX >= minimizeButtonX && mouseX < minimizeButtonX + buttonSize &&
            mouseY >= buttonY && mouseY < buttonY + buttonSize;

        if (win.isMinimizeButtonHovered !== isHoveringMinimizeButton) {
            win.isMinimizeButtonHovered = isHoveringMinimizeButton;
            needsRender = true;
        }

        if (win.isMaximizeButtonHovered !== isHoveringMaximizeButton) {
            win.isMaximizeButtonHovered = isHoveringMaximizeButton;
            needsRender = true;
        }

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
    taskbarOrderWindows.length = 0;
    activeWindow = null;
}

function setActiveWindow(win) {
    activeWindow = win;
}

export { createWindow, renderWindows, windows, activeWindow, closeAll, setActiveWindow, taskbarOrderWindows };