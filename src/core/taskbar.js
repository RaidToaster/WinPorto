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

setInterval(updateTime, 1000); // Update time every second

// Load the Start button icon
const startIcon = new Image();
startIcon.src = './Windows XP Icons/clipart2400718.png';

function renderTaskbar() {
    // Create the main taskbar gradient
    const taskbarGradient = ctx.createLinearGradient(0, canvas.height - TASKBAR_HEIGHT, 0, canvas.height);
    taskbarGradient.addColorStop(0, '#2972E8');
    taskbarGradient.addColorStop(1, '#245EDC');

    // Draw taskbar background
    ctx.fillStyle = taskbarGradient;
    ctx.fillRect(0, canvas.height - TASKBAR_HEIGHT, canvas.width, TASKBAR_HEIGHT);

    // Add subtle light border to the top of the taskbar
    ctx.strokeStyle = '#FFFFFF'; // White or very light gray
    ctx.lineWidth = 0.4; // Very thin line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - TASKBAR_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - TASKBAR_HEIGHT);
    ctx.stroke();

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
    ctx.font = 'bold italic 20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('start', 15 + 24 + 5, canvas.height - TASKBAR_HEIGHT / 2); // Adjust text position

    // Draw Clock Area
    const clockWidth = 100;
    const clockX = canvas.width - clockWidth;
    const clockGradient = ctx.createLinearGradient(clockX, canvas.height - TASKBAR_HEIGHT, clockX, canvas.height);
    clockGradient.addColorStop(0, '#4A90E2'); // Lighter blue at the top
    clockGradient.addColorStop(1, '#2972E8'); // Blending with taskbar blue at the bottom

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
    ctx.font = '12px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'center';
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(timeString, canvas.width - clockWidth / 2, canvas.height - TASKBAR_HEIGHT / 2);
}

function handleTaskbarClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const startButtonX = 0;
    const startButtonY = canvas.height - TASKBAR_HEIGHT;
    const startButtonRight = START_BUTTON_WIDTH;
    const startButtonBottom = canvas.height;

    if (mouseX > startButtonX && mouseX < startButtonRight &&
        mouseY > startButtonY && mouseY < startButtonBottom) {
        toggleStartMenu();
        console.log('Start button clicked!'); // For debugging
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

export { renderTaskbar, handleTaskbarClick, TASKBAR_HEIGHT };