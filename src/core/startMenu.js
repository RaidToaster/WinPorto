import { loadApp } from './appRegistry.js';
import { closeAll } from './windowManager.js';

let isMenuOpen = false;
const startMenu = document.createElement('div');
startMenu.id = 'start-menu';
startMenu.classList.add('hidden');
document.body.appendChild(startMenu);

const menuItems = [
    { name: 'Internet Explorer', action: 'launch_placeholder', icon: '../../Windows XP Icons/Explorer.png' },
    { name: 'Outlook Express', action: 'launch_placeholder', icon: '../../Windows XP Icons/Email.png' },
    { name: 'Minesweeper', action: 'launch_placeholder', icon: '../../Windows XP Icons/Game Controller.png' },
    { name: 'Notepad', action: 'launch_placeholder', icon: '../../Windows XP Icons/Generic Text Document.png' },
    { name: 'Winamp', action: 'launch_placeholder', icon: '../../Windows XP Icons/Generic Media.png' },
    { name: 'Paint', action: 'launch_placeholder', icon: '../../Windows XP Icons/Bitmap.png' },
    { name: 'Windows Media Player', action: 'launch_placeholder', icon: '../../Windows XP Icons/Generic Video.png' },
    { name: 'Windows Messenger', action: 'launch_placeholder', icon: '../../Windows XP Icons/User Accounts.png' },
    { name: 'All Programs', action: 'show_all_programs', icon: '../../Windows XP Icons/Folder Opened.png' },
];

function handleLogOff() {
    console.log('Logging off...');
    closeAll();
}

function handleShutdown() {
    console.log('Shutting down...');
    closeAll();
    document.body.innerHTML = '<div class="shutdown-message">Shutting Down...</div>';
}

function renderStartMenu() {
    startMenu.innerHTML = ''; // Clear existing items

    // Full-width header
    const header = document.createElement('div');
    header.className = 'menu-header';
    header.innerHTML = '<img src="../../icons/User Accounts.png" alt="User"><span>Kevin P.M</span>';
    startMenu.appendChild(header);

    // Panels container for left and right side-by-side
    const panelsContainer = document.createElement('div');
    panelsContainer.className = 'panels-container';

    // Left panel (programs, white bg)
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';

    const menuList = document.createElement('ul');
    menuItems.forEach(item => {
        if (item.isSeparator) {
            const separator = document.createElement('hr');
            menuList.appendChild(separator);
            return;
        }
        const listItem = document.createElement('li');
        listItem.innerHTML = `<img src="${item.icon}" alt="${item.name}"><span>${item.name}</span>`;
        listItem.onclick = () => {
            switch (item.action) {
                case 'launch_placeholder':
                    break;
                case 'show_games_submenu':
                    const gamesSubMenu = document.createElement('ul');
                    gamesSubMenu.className = 'submenu';
                    const games = ['Pong', 'Snake'];
                    games.forEach(game => {
                        const gameItem = document.createElement('li');
                        gameItem.textContent = game;
                        gameItem.onclick = (e) => {
                            e.stopPropagation();
                            loadApp(game);
                            toggleStartMenu();
                        };
                        gamesSubMenu.appendChild(gameItem);
                    });

                    const existingGamesSubmenu = listItem.querySelector('.submenu');
                    if (existingGamesSubmenu) {
                        existingGamesSubmenu.remove();
                    } else {
                        listItem.appendChild(gamesSubMenu);
                    }
                    return; // Prevent the menu from closing

                case 'show_all_programs':
                    const allProgramsSubMenu = document.createElement('ul');
                    allProgramsSubMenu.className = 'submenu';
                    const allApps = menuItems.filter(item => item.name !== 'All Programs');
                    allApps.forEach(item => {
                        const appItem = document.createElement('li');
                        appItem.innerHTML = `<img src="${item.icon}" alt="${item.name}"><span>${item.name}</span>`;
                        appItem.onclick = (e) => {
                            e.stopPropagation();
                            switch (item.action) {
                                case 'launch_placeholder':
                                    break;
                                default:
                                    // Handle other actions if any
                                    break;
                            }
                            toggleStartMenu();
                        };
                        allProgramsSubMenu.appendChild(appItem);
                    });

                    const existingAllSubmenu = listItem.querySelector('.submenu');
                    if (existingAllSubmenu) {
                        existingAllSubmenu.remove();
                    } else {
                        listItem.appendChild(allProgramsSubMenu);
                    }
                    return; // Prevent closing

                case 'close_all_windows':
                    closeAll();
                    break;
                default:
                    // No action
                    break;
            }
            toggleStartMenu();
        };
        menuList.appendChild(listItem);
    });
    leftPanel.appendChild(menuList);
    panelsContainer.appendChild(leftPanel);

    // Right panel (system folders, blue bg)
    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';

    const rightMenuItems = [
        { name: 'My Documents', icon: '../../Windows XP Icons/My Documents.png' },
        { name: 'My Pictures', icon: '../../Windows XP Icons/My Pictures.png' },
        { name: 'My Music', icon: '../../Windows XP Icons/My Music.png' },
        { name: 'My Computer', icon: '../../Windows XP Icons/My Computer.png' },
        { name: 'Control Panel', icon: '../../Windows XP Icons/Control Panel.png' },
        { name: 'Connect To', icon: '../../Windows XP Icons/Entire Network.png' },
        { name: 'Printers and Faxes', icon: '../../Windows XP Icons/Printers.png' },
        { name: 'Help and Support', icon: '../../Windows XP Icons/Help and Support.png' },
        { name: 'Search', icon: '../../Windows XP Icons/Search.png' },
        { name: 'Run', icon: '../../Windows XP Icons/Run.png' }
    ];

    const rightMenuList = document.createElement('ul');
    rightMenuItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<img src="${item.icon}" alt="${item.name}"><span>${item.name}</span>`;
        if (item.small) {
            listItem.classList.add('small-text');
        }
        rightMenuList.appendChild(listItem);
    });

    rightPanel.appendChild(rightMenuList);
    panelsContainer.appendChild(rightPanel);

    startMenu.appendChild(panelsContainer);

    // Full-width footer
    const footer = document.createElement('div');
    footer.className = 'menu-footer';
    const logOffButton = document.createElement('button');
    logOffButton.innerHTML = `<img src=icons/Log Off.png alt="Log Off"><span>Log off</span>`;
    logOffButton.onclick = handleLogOff;
    const shutdownButton = document.createElement('button');
    shutdownButton.innerHTML = `<img src=icons/Turn Off Computer.png alt="Turn Off"><span>Turn off computer</span>`;
    shutdownButton.onclick = handleShutdown;
    footer.appendChild(logOffButton);
    footer.appendChild(shutdownButton);
    startMenu.appendChild(footer);
}

function toggleStartMenu() {
    isMenuOpen = !isMenuOpen;
    startMenu.classList.toggle('hidden');
    if (isMenuOpen) {
        renderStartMenu();
    }
}

export { toggleStartMenu, isMenuOpen };