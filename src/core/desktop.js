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
    { name: 'About Me', app: 'About Me', img: new Image(), x: 30, y: 30, width: 48, height: 48},
    { name: 'Projects', app: 'Projects', img: new Image(), x: 30, y: 120, width: 48, height: 48 },
    { name: 'Contact', app: 'Contact', img: new Image(), x: 30, y: 210, width: 48, height: 48 },
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
        ctx.drawImage(icon.img, icon.x, icon.y, icon.width, icon.height);
        ctx.fillStyle = 'white';
        ctx.font = '14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon.name, icon.x + icon.width / 2, icon.y + icon.height + 15);
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
    if (isMenuOpen) {
        handleStartMenuMouseMove(event);
    } else {
        handleTaskbarMouseMove(event);
    }
}

canvas.addEventListener('click', handleDesktopClick);
canvas.addEventListener('mousemove', handleCanvasMouseMove);


export { renderDesktop };