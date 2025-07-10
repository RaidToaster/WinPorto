import { ctx, canvas } from './canvas.js';
import { loadApp } from './appRegistry.js';
import { handleTaskbarClick, TASKBAR_HEIGHT, handleTaskbarMouseMove } from './taskbar.js';
import { isMenuOpen, handleStartMenuClick, handleStartMenuMouseMove } from './startMenu.js';

const wallpaper = new Image();
let wallpaperLoaded = false;
wallpaper.src = 'src/background.jpg';
wallpaper.onload = () => {
    wallpaperLoaded = true;
};

const icons = [
    { name: 'About Me', app: 'About Me', img: new Image(), x: 30, y: 30, width: 48, height: 48, isHovered: false },
    { name: 'Projects', app: 'Projects', img: new Image(), x: 30, y: 120, width: 48, height: 48, isHovered: false },
    { name: 'Contact', app: 'Contact', img: new Image(), x: 30, y: 210, width: 48, height: 48, isHovered: false },
];

icons[0].img.src = './Windows XP Icons/User Accounts.png';
icons[1].img.src = './Windows XP Icons/Briefcase.png';
icons[2].img.src = './Windows XP Icons/Email.png';

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
        if (icon.isHovered) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
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

function handleDesktopClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    console.log('Desktop click detected. isMenuOpen:', isMenuOpen); // Debugging log

    // If the start menu is open, delegate click to start menu handler
    if (isMenuOpen) {
        console.log('Start menu is open, delegating click to start menu handler.'); // Debugging log
        handleStartMenuClick(event);
        return;
    }

    // Check if the click is on the taskbar
    if (mouseY > canvas.height - TASKBAR_HEIGHT) {
        handleTaskbarClick(event);
        return; // Prevent desktop icon logic from running
    }

    icons.forEach(icon => {
        if (mouseX > icon.x && mouseX < icon.x + icon.width &&
            mouseY > icon.y && mouseY < icon.y + icon.height) {
            loadApp(icon.app);
        }
    });
}

function handleCanvasMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let needsRender = false;

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
            const highlightHeight = highlightSize + 25; // Match the rendering height

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

canvas.addEventListener('click', handleDesktopClick);
canvas.addEventListener('mousemove', handleCanvasMouseMove);


export { renderDesktop };