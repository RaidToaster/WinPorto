import { ctx, canvas } from './canvas.js';
import { loadApp } from './appRegistry.js';
import { closeAll } from './windowManager.js';

let isMenuOpen = false;
let hoveredMenuItemIndex = -1;

const MENU_WIDTH = 350;
const MENU_HEIGHT = 450;
const LEFT_PANEL_WIDTH = 175;
const MENU_ITEM_HEIGHT = 35;
const HEADER_HEIGHT = 50;
const HEADER_PADDING_X = 15;

const menuItems = [
    { name: 'About Me', action: 'launch_app_about' },
    { name: 'Projects', action: 'launch_app_projects' },
    { name: 'Contact', action: 'launch_app_contact' },
    { name: 'Games', action: 'show_games_submenu' },
    { name: 'Close All Windows', action: 'close_all_windows' },
];

function toggleStartMenu() {
    isMenuOpen = !isMenuOpen;
    console.log('Start menu toggled. isMenuOpen:', isMenuOpen); // Debugging log
    if (!isMenuOpen) {
        hoveredMenuItemIndex = -1; // Reset hover when menu closes
    }
}

function closeStartMenu() {
    isMenuOpen = false;
    console.log('Start menu closed. isMenuOpen:', isMenuOpen);
    hoveredMenuItemIndex = -1;
}

function renderStartMenu() {
    if (!isMenuOpen) return;

    const menuX = 0;
    const menuY = canvas.height - MENU_HEIGHT - 30;

    // Left Panel (darker)
    ctx.fillStyle = '#245EDC';
    ctx.fillRect(menuX, menuY, LEFT_PANEL_WIDTH, MENU_HEIGHT);

    // Right Panel (lighter)
    const rightPanelGradient = ctx.createLinearGradient(menuX + LEFT_PANEL_WIDTH, menuY, menuX + MENU_WIDTH, menuY);
    rightPanelGradient.addColorStop(0, '#D4E5F7');
    rightPanelGradient.addColorStop(1, '#B0C4DE');
    ctx.fillStyle = rightPanelGradient;
    ctx.fillRect(menuX + LEFT_PANEL_WIDTH, menuY, MENU_WIDTH - LEFT_PANEL_WIDTH, MENU_HEIGHT);

    // Header
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(menuX, menuY, MENU_WIDTH, HEADER_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kevin P.M', menuX + HEADER_PADDING_X, menuY + (HEADER_HEIGHT / 2));

    // Render Menu Items on the left panel
    menuItems.forEach((item, index) => {
        const itemY = menuY + 60 + index * MENU_ITEM_HEIGHT;
        const itemX = menuX;
        const itemWidth = LEFT_PANEL_WIDTH;
        const itemHeight = MENU_ITEM_HEIGHT;

        // Draw hover background if applicable
        if (index === hoveredMenuItemIndex) {
            ctx.fillStyle = '#316AC5'; // Highlight color for hovered item
            ctx.fillRect(itemX, itemY, itemWidth, itemHeight);
        }

        ctx.fillStyle = 'white';
        ctx.font = '16px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, menuX + 20, itemY + MENU_ITEM_HEIGHT / 2);
    });

    // Menu Border
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = 1;
    ctx.strokeRect(menuX, menuY, MENU_WIDTH, MENU_HEIGHT);
}

function handleStartMenuClick(event) {
    if (!isMenuOpen) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const menuX = 0;
    const menuY = canvas.height - MENU_HEIGHT - 30; // Must match render position

    // Check if click is within the left panel where menu items are
    if (mouseX >= menuX && mouseX <= menuX + LEFT_PANEL_WIDTH &&
        mouseY >= menuY + HEADER_HEIGHT && mouseY <= menuY + MENU_HEIGHT) {

        menuItems.forEach((item, index) => {
            const itemY = menuY + 60 + index * MENU_ITEM_HEIGHT;
            const itemX = menuX;
            const itemWidth = LEFT_PANEL_WIDTH;
            const itemHeight = MENU_ITEM_HEIGHT;

            if (mouseX > itemX && mouseX < itemX + itemWidth &&
                mouseY > itemY && mouseY < itemY + itemHeight) {
                console.log(`StartMenu: Clicked on menu item: ${item.name}`); // Debugging log
                event.stopPropagation(); // Stop event from bubbling further

                // Execute action based on item
                switch (item.action) {
                    case 'launch_app_about':
                        loadApp('About Me');
                        break;
                    case 'launch_app_projects':
                        loadApp('Projects');
                        break;
                    case 'launch_app_contact':
                        loadApp('Contact');
                        break;
                    case 'show_games_submenu':
                        console.log('Games submenu not yet implemented.');
                        break;
                    case 'close_all_windows':
                        closeAll();
                        break;
                    default:
                        console.log('Unknown menu item action:', item.action);
                }
                closeStartMenu(); // Close menu after click
                return; // Stop processing after finding a match
            }
        });
    }
}

function handleStartMenuMouseMove(event) {
    if (!isMenuOpen) {
        if (hoveredMenuItemIndex !== -1) {
            hoveredMenuItemIndex = -1; // Reset if menu closes while hovering
            // renderStartMenu(); // Re-render to clear hover
        }
        return;
    }

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const menuX = 0;
    const menuY = canvas.height - MENU_HEIGHT - 30;

    let newHoveredIndex = -1;

    if (mouseX >= menuX && mouseX <= menuX + LEFT_PANEL_WIDTH &&
        mouseY >= menuY + HEADER_HEIGHT && mouseY <= menuY + MENU_HEIGHT) {

        menuItems.forEach((item, index) => {
            const itemY = menuY + 60 + index * MENU_ITEM_HEIGHT;
            const itemX = menuX;
            const itemWidth = LEFT_PANEL_WIDTH;
            const itemHeight = MENU_ITEM_HEIGHT;

            if (mouseX > itemX && mouseX < itemX + itemWidth &&
                mouseY > itemY && mouseY < itemY + itemHeight) {
                newHoveredIndex = index;
            }
        });
    }

    if (newHoveredIndex !== hoveredMenuItemIndex) {
        hoveredMenuItemIndex = newHoveredIndex;
        renderStartMenu();
    }
}

export { renderStartMenu, toggleStartMenu, isMenuOpen, menuItems, handleStartMenuClick, handleStartMenuMouseMove };