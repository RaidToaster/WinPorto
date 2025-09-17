import { loadApp } from './appRegistry.js';
import { closeAll } from './windowManager.js';

let isMenuOpen = false;
const startMenu = document.createElement('div');
startMenu.id = 'start-menu';
startMenu.style.display = 'none';
document.body.appendChild(startMenu);

const menuItems = [
    { name: 'About Me', action: 'launch_app_about' },
    { name: 'Projects', action: 'launch_app_projects' },
    { name: 'Contact', action: 'launch_app_contact' },
    { name: 'Games', action: 'show_games_submenu' },
    { name: 'Close All Windows', action: 'close_all_windows' },
];

function handleLogOff() {
    console.log('Logging off...');
    closeAll();
    alert('You have been logged off.');
}

function handleShutdown() {
    console.log('Shutting down...');
    closeAll();
    document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 50vh;">Shutting Down...</div>';
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
        const listItem = document.createElement('li');
        listItem.textContent = item.name;
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
                    console.log('Games submenu not yet implemented.');
                    break;
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
    logOffButton.textContent = 'Log Off';
    logOffButton.onclick = handleLogOff;
    const shutdownButton = document.createElement('button');
    shutdownButton.textContent = 'Turn Off';
    shutdownButton.onclick = handleShutdown;
    footer.appendChild(logOffButton);
    footer.appendChild(shutdownButton);
    leftPanel.appendChild(footer);
    
    startMenu.appendChild(leftPanel);
}

function toggleStartMenu() {
    isMenuOpen = !isMenuOpen;
    startMenu.style.display = isMenuOpen ? 'block' : 'none';
    if(isMenuOpen) {
        renderStartMenu();
    }
}

export { toggleStartMenu, isMenuOpen };