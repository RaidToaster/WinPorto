import { createWindow } from '../core/windowManager.js';
import portfolioData from '../assets/portfolio/portfolioData.js';
import { wrapText } from '../core/canvas.js';

// Define constants for layout
const SIDEBAR_WIDTH = 180;
const TOOLBAR_HEIGHT = 40;
const ICON_SIZE = 48;
const CATEGORY_SPACING = 60;

// Preload icons
const folderIcon = new Image();
folderIcon.src = 'Windows XP Icons/folder_open.png';

function explorerApp() {
    createWindow("My Portfolio", (ctx, win) => {
        ctx.fillStyle = '#ECE9D8';
        ctx.fillRect(win.x + 2, win.y + 2 + 30, win.width - 4, win.height - 4 - 30);

        // Draw sidebar
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(win.x + 2, win.y + 2 + TOOLBAR_HEIGHT, SIDEBAR_WIDTH, win.height - 4 - TOOLBAR_HEIGHT);

        // Draw toolbar
        ctx.fillStyle = '#E3E3E3';
        ctx.fillRect(win.x + 2, win.y + 2 + 30, win.width - 4, TOOLBAR_HEIGHT);

        // Draw toolbar text
        ctx.fillStyle = 'black';
        ctx.font = '14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillText('Back', win.x + 10, win.y + 30 + TOOLBAR_HEIGHT / 2);
        ctx.fillText('Up', win.x + 60, win.y + 30 + TOOLBAR_HEIGHT / 2);
        ctx.fillText('Path: My Portfolio', win.x + 120, win.y + 30 + TOOLBAR_HEIGHT / 2);

        // Draw sidebar header
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillText('Categories', win.x + 10, win.y + 30 + TOOLBAR_HEIGHT + 20);

        // Draw categories with icons
        let categoryY = win.y + 30 + TOOLBAR_HEIGHT + 50;
        portfolioData.categories.forEach(category => {
            // Draw folder icon
            if (folderIcon.complete) {
                // ctx.drawImage(folderIcon, win.x + 10, categoryY - 10, ICON_SIZE, ICON_SIZE);
            }

            // Draw category name
            ctx.fillStyle = 'black';
            ctx.font = '14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
            wrapText(category.name, win.x + 70, categoryY + ICON_SIZE / 2, SIDEBAR_WIDTH - 80, 14);

            categoryY += CATEGORY_SPACING;
        });

        // Draw main content header
        ctx.fillStyle = 'black';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.fillText('Select a category to view files', win.x + SIDEBAR_WIDTH + 20, win.y + 30 + TOOLBAR_HEIGHT + 30);
    });
}

export { explorerApp };