// Core Taskbar: Renders the taskbar, start button, clock, and open window tabs.
import { ctx, canvas } from './canvas.js';
import { toggleStartMenu } from './startMenu.js';

const TASKBAR_HEIGHT = 30; // Adjusted for a more classic feel
const START_BUTTON_WIDTH = 110;

let currentTime = new Date();
let isStartButtonHovered = false;
function updateTime() {
    currentTime = new Date();
}

setInterval(updateTime, 1000 * 60); // Update time every second

// Load the Start button icon
const startIcon = new Image();
startIcon.src = './Windows XP Icons/clipart2400718.png';

import { windows, activeWindow, setActiveWindow, taskbarOrderWindows } from './windowManager.js';

function renderTaskbar() {
    // Create the main taskbar gradient
    const taskbarGradient = ctx.createLinearGradient(0, canvas.height - TASKBAR_HEIGHT, 0, canvas.height);
    taskbarGradient.addColorStop(0, 'rgb(31, 47, 134)');
    taskbarGradient.addColorStop(0.03, 'rgb(49, 101, 196)');
    taskbarGradient.addColorStop(0.06, 'rgb(54, 130, 229)');
    taskbarGradient.addColorStop(0.10, 'rgb(68, 144, 230)');
    taskbarGradient.addColorStop(0.12, 'rgb(56, 131, 229)');
    taskbarGradient.addColorStop(0.15, 'rgb(43, 113, 224)');
    taskbarGradient.addColorStop(0.18, 'rgb(38, 99, 218)');
    taskbarGradient.addColorStop(0.20, 'rgb(35, 91, 214)');
    taskbarGradient.addColorStop(0.23, 'rgb(34, 88, 213)');
    taskbarGradient.addColorStop(0.38, 'rgb(33, 87, 214)');
    taskbarGradient.addColorStop(0.54, 'rgb(36, 93, 219)');
    taskbarGradient.addColorStop(0.86, 'rgb(37, 98, 223)');
    taskbarGradient.addColorStop(0.89, 'rgb(36, 95, 220)');
    taskbarGradient.addColorStop(0.92, 'rgb(33, 88, 212)');
    taskbarGradient.addColorStop(0.95, 'rgb(29, 78, 192)');
    taskbarGradient.addColorStop(0.98, 'rgb(25, 65, 165)');

    // Draw taskbar background
    ctx.fillStyle = taskbarGradient;
    ctx.fillRect(0, canvas.height - TASKBAR_HEIGHT, canvas.width, TASKBAR_HEIGHT);

    // Draw window buttons
    let x = START_BUTTON_WIDTH + 10; // Add offset after start button
    const buttonHeight = TASKBAR_HEIGHT - 4; // 2px margin top and bottom
    const buttonTop = canvas.height - TASKBAR_HEIGHT + 2;

    windowButtons.length = 0; // Clear old buttons

    taskbarOrderWindows.forEach(win => {
        const buttonWidth = 150; // fixed width for now
        // Check if we have space
        if (x + buttonWidth > canvas.width - 100) return; // Leave space for clock

        // Store button info for click handling
        windowButtons.push({
            x: x,
            y: buttonTop + 3,
            width: buttonWidth,
            height: buttonHeight,
            winId: win.id
        });

        // Draw button background with rounded corners using roundRect
        if (win === activeWindow && !win.minimized) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        }
        const radius = 2;
        ctx.beginPath();
        ctx.roundRect(x, buttonTop, buttonWidth, buttonHeight, radius);
        ctx.fill();

        // Draw button with rounded corners using roundRect
        ctx.beginPath();
        ctx.roundRect(x, buttonTop, buttonWidth, buttonHeight, radius);
        ctx.fill();

        // Draw button icon
        const iconSize = 20;
        const iconX = x + 8;
        if (win.icon && win.icon.complete) {
            const iconY = buttonTop + buttonHeight / 2 - iconSize / 2;
            ctx.drawImage(win.icon, iconX, iconY, iconSize, iconSize);
        } else {
            // Draw a white square
            ctx.fillStyle = 'white';
            ctx.fillRect(x + 8, buttonTop + buttonHeight / 2 - 10, 20, 20);
        }

        // Draw button text
        ctx.fillStyle = 'white';
        ctx.font = '12px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const maxWidth = buttonWidth - 16; // Padding for rounded corners
        let title = win.title;
        if (ctx.measureText(title).width > maxWidth) {
            while (title.length > 3 && ctx.measureText(title + '...').width > maxWidth) {
                title = title.slice(0, -1);
            }
            title += '...';
        }
        ctx.fillText(title, x + 8 + iconSize + 4, buttonTop + buttonHeight / 2 + 2);

        x += buttonWidth + 2; // 2px gap between buttons
    });

    // // Add subtle light border to the top of the taskbar
    // ctx.strokeStyle = '#FFFFFF'; // White or very light gray
    // ctx.lineWidth = 0.4; // Very thin line
    // ctx.beginPath();
    // ctx.moveTo(0, canvas.height - TASKBAR_HEIGHT);
    // ctx.lineTo(canvas.width, canvas.height - TASKBAR_HEIGHT);
    // ctx.stroke();

    // Draw Start Button
    let startButtonGradient;
    if (isStartButtonHovered) {
        startButtonGradient = ctx.createLinearGradient(0, canvas.height - TASKBAR_HEIGHT, 0, canvas.height);
        startButtonGradient.addColorStop(0, '#5CB85C'); // Lighter green for hover
        startButtonGradient.addColorStop(1, '#4CAE4C'); // Darker green for hover
    } else {
        startButtonGradient = ctx.createLinearGradient(0, canvas.height - TASKBAR_HEIGHT, 0, canvas.height);
        startButtonGradient.addColorStop(0, '#3D9B3D');
        startButtonGradient.addColorStop(1, '#2A6E2A');
    }

    ctx.fillStyle = startButtonGradient;
    const cornerRadius = 8; // Radius for the rounded corner
    ctx.beginPath();
    ctx.moveTo(0, canvas.height); // Start at bottom-left
    ctx.lineTo(0, canvas.height - TASKBAR_HEIGHT); // Line to top-left
    ctx.lineTo(START_BUTTON_WIDTH - cornerRadius, canvas.height - TASKBAR_HEIGHT); // Line to just before top-right curve
    ctx.arcTo(START_BUTTON_WIDTH, canvas.height - TASKBAR_HEIGHT, // Control point 1 (top-right corner)
        START_BUTTON_WIDTH, canvas.height - TASKBAR_HEIGHT + cornerRadius, // Control point 2 (start of vertical line after curve)
        cornerRadius); // Radius
    ctx.lineTo(START_BUTTON_WIDTH, canvas.height); // Line to bottom-right
    ctx.closePath(); // Close path to bottom-left
    ctx.fill();

    // Draw Start Button Icon
    if (startIcon.complete) {
        const iconSize = 24; // Adjust size as needed
        const iconX = 10;
        const iconY = canvas.height - TASKBAR_HEIGHT / 2 - iconSize / 2;
        ctx.drawImage(startIcon, iconX, iconY, iconSize, iconSize);
    }

    // Draw Start Button Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold italic 20px "Franklin Gothic Medium", "Franklin Gothic", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('start', 15 + 24 + 5, canvas.height - TASKBAR_HEIGHT / 2); // Adjust text position

    // Draw Clock Area
    const clockWidth = 100;
    const clockX = canvas.width - clockWidth;
    const clockGradient = ctx.createLinearGradient(clockX, canvas.height - TASKBAR_HEIGHT, clockX, canvas.height);
    clockGradient.addColorStop(0.01, 'rgb(12, 89, 185)');
    clockGradient.addColorStop(0.06, 'rgb(19, 158, 233)');
    clockGradient.addColorStop(0.10, 'rgb(24, 181, 242)');
    clockGradient.addColorStop(0.14, 'rgb(19, 155, 235)');
    clockGradient.addColorStop(0.19, 'rgb(18, 144, 232)');
    clockGradient.addColorStop(0.63, 'rgb(13, 141, 234)');
    clockGradient.addColorStop(0.81, 'rgb(13, 159, 241)');
    clockGradient.addColorStop(0.88, 'rgb(15, 158, 237)');
    clockGradient.addColorStop(0.91, 'rgb(17, 155, 233)');
    clockGradient.addColorStop(0.94, 'rgb(19, 146, 226)');
    clockGradient.addColorStop(0.97, 'rgb(19, 126, 215)');
    clockGradient.addColorStop(1.00, 'rgb(9, 91, 201)');

    ctx.fillStyle = clockGradient;
    ctx.fillRect(clockX, canvas.height - TASKBAR_HEIGHT, clockWidth, TASKBAR_HEIGHT);

    // Add subtle light border to the clock area
    ctx.strokeStyle = '#FFFFFF'; // White or very light gray
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    ctx.moveTo(clockX, canvas.height - TASKBAR_HEIGHT); // Top-left corner
    ctx.lineTo(clockX, canvas.height); // Line down left edge
    ctx.moveTo(clockX, canvas.height - TASKBAR_HEIGHT); // Top-left corner
    ctx.lineTo(canvas.width, canvas.height - TASKBAR_HEIGHT); // Line across top edge
    ctx.stroke();

    // Draw Clock Text
    ctx.fillStyle = 'white';
    ctx.font = '13px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'center';
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(timeString, canvas.width - clockWidth / 2, canvas.height - TASKBAR_HEIGHT / 2);
}

let windowButtons = [];

function handleTaskbarClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const startButtonX = 0;
    const startButtonY = canvas.height - TASKBAR_HEIGHT;
    const startButtonRight = START_BUTTON_WIDTH;
    const startButtonBottom = canvas.height;

    // Check if clicked on start button
    if (mouseX > startButtonX && mouseX < startButtonRight &&
        mouseY > startButtonY && mouseY < startButtonBottom) {
        console.log('Taskbar: Start button area clicked, calling toggleStartMenu.'); // Debugging log
        toggleStartMenu();
        event.stopPropagation(); // Prevent event from bubbling up to desktop
        return;
    }

    // Check if clicked on a window button
    for (const button of windowButtons) {
        if (mouseX >= button.x && mouseX < button.x + button.width &&
            mouseY >= button.y && mouseY < button.y + button.height) {
            const win = windows.find(w => w.id === button.winId);
            if (win) {
                if (win.minimized) {
                    console.log(`Taskbar: Restoring window ${win.title}`);
                    win.minimized = false;
                    setActiveWindow(win);
                } else {
                    console.log(`Taskbar: Minimizing window ${win.title}`);
                    win.minimized = true;
                }
                event.stopPropagation();
                return;
            }
        }
    }
}

export function handleTaskbarMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const startButtonX = 0;
    const startButtonY = canvas.height - TASKBAR_HEIGHT;
    const startButtonRight = START_BUTTON_WIDTH;
    const startButtonBottom = canvas.height;

    const wasHovered = isStartButtonHovered;

    if (mouseX > startButtonX && mouseX < startButtonRight &&
        mouseY > startButtonY && mouseY < startButtonBottom) {
        isStartButtonHovered = true;
    } else {
        isStartButtonHovered = false;
    }

    if (wasHovered !== isStartButtonHovered) {
        renderTaskbar();
    }
}

canvas.addEventListener('mousemove', handleTaskbarMouseMove);

export { renderTaskbar, handleTaskbarClick, TASKBAR_HEIGHT, START_BUTTON_WIDTH };