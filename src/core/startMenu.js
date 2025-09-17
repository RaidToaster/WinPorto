import { loadApp } from './appRegistry.js';
import { closeAll } from './windowManager.js';

let isMenuOpen = false;
const startMenu = document.createElement('div');
startMenu.id = 'start-menu';
startMenu.classList.add('hidden');
document.body.appendChild(startMenu);

const menuItems = [
    { name: 'About Me', action: 'launch_app_about', icon: '../../Windows XP Icons/User Accounts.png' },
    { name: 'Projects', action: 'launch_app_projects', icon: '../../Windows XP Icons/Briefcase.png' },
    { name: 'Contact', action: 'launch_app_contact', icon: '../../Windows XP Icons/Email.png' },
    { name: 'Games', action: 'show_games_submenu', icon: '../../Windows XP Icons/Game Controller.png' },
    { name: 'All Programs', action: 'show_all_programs', icon: '../../Windows XP Icons/Programs.png' },
];

function handleLogOff() {
    console.log('Logging off...');
    closeAll();
    alert('You have been logged off.');
}

function handleShutdown() {
    console.log('Shutting down...');
    closeAll();
    document.body.innerHTML = '<div class="shutdown-message">Shutting Down...</div>';
    alert('System is shutting down. Goodbye!');
}

function renderStartMenu() {
    startMenu.innerHTML = ''; // Clear existing items

    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';

    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = '<img src="../../icons/User Accounts.png" alt="User"><span>Kevin P.M</span>';
    leftPanel.appendChild(header);

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
                    const allApps = ['About Me', 'Projects', 'Contact', 'Explorer'];
                    allApps.forEach(app => {
                        const appItem = document.createElement('li');
                        appItem.textContent = app;
                        appItem.onclick = (e) => {
                            e.stopPropagation();
                            loadApp(app);
                            toggleStartMenu();
                        };
                        allProgramsSubMenu.appendChild(appItem);
                    });
                    // Add Games sub-sub
                    const gamesItem = document.createElement('li');
                    gamesItem.innerHTML = 'Games >';
                    gamesItem.onclick = (e) => {
                        e.stopPropagation();
                        // Toggle games sub-sub if needed, but for simplicity, show games submenu here
                        const gamesSubSub = document.createElement('ul');
                        gamesSubSub.className = 'sub-submenu';
                        const subGames = ['Pong', 'Snake'];
                        subGames.forEach(game => {
                            const subGameItem = document.createElement('li');
                            subGameItem.textContent = game;
                            subGameItem.onclick = (e2) => {
                                e2.stopPropagation();
                                loadApp(game);
                                toggleStartMenu();
                            };
                            gamesSubSub.appendChild(subGameItem);
                        });
                        const existingSubSub = gamesItem.querySelector('.sub-submenu');
                        if (existingSubSub) {
                            existingSubSub.remove();
                        } else {
                            gamesItem.appendChild(gamesSubSub);
                        }
                    };
                    allProgramsSubMenu.appendChild(gamesItem);

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
            }
            toggleStartMenu();
        };
        menuList.appendChild(listItem);
    });
    leftPanel.appendChild(menuList);

    const footer = document.createElement('div');
    footer.className = 'footer';
    const logOffButton = document.createElement('button');
    logOffButton.innerHTML = `<img src="../../Windows XP Icons/Log Off.png" alt="Log Off"><span>Log off</span>`;
    logOffButton.onclick = handleLogOff;
    const shutdownButton = document.createElement('button');
    shutdownButton.innerHTML = `<img src="../../Windows XP Icons/Turn Off Computer.png" alt="Turn Off"><span>Turn off computer</span>`;
    shutdownButton.onclick = handleShutdown;
    footer.appendChild(logOffButton);
    footer.appendChild(shutdownButton);
    leftPanel.appendChild(footer);

    startMenu.appendChild(leftPanel);

    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';

    const rightMenuItems = [
        { name: 'My Documents', icon: '../../Windows XP Icons/My Documents.png' },
        { name: 'My Recent<br>Documents', icon: '../../Windows XP Icons/Folder Opened.png', small: true },
        { name: 'My Pictures', icon: '../../Windows XP Icons/My Pictures.png' },
        { name: 'My Music', icon: '../../Windows XP Icons/My Music.png' },
        { name: 'My Computer', icon: '../../Windows XP Icons/My Computer.png' },
        { name: 'Control Panel', icon: '../../Windows XP Icons/Control Panel.png' },
        { name: 'Set program access and defaults', icon: '../../Windows XP Icons/Default Programs.png' },
        { name: 'Connect to', icon: '../../Windows XP Icons/Entire Network.png' },
        { name: 'Printers and Faxes', icon: '../../Windows XP Icons/Printers.png' },
        { name: 'Help and Support', icon: '../../Windows XP Icons/Help and Support.png' },
        { name: 'Search', icon: '../../Windows XP Icons/Search.png' },
        { name: 'Run...', icon: '../../Windows XP Icons/Run.png' }
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
    startMenu.appendChild(rightPanel);
}

function toggleStartMenu() {
    isMenuOpen = !isMenuOpen;
    startMenu.classList.toggle('hidden');
    if (isMenuOpen) {
        renderStartMenu();
    }
}

export { toggleStartMenu, isMenuOpen };