// Core Taskbar: Renders the taskbar, start button, clock, and open window tabs.
import { windows, activeWindow, setActiveWindow } from './windowManager.js';
import { toggleStartMenu } from './startMenu.js';

const taskbar = document.getElementById('taskbar');

function renderTaskbar() {
    taskbar.innerHTML = ''; // Clear existing content

    const taskbarLeft = document.createElement('div');
    taskbarLeft.className = 'taskbar-left';

    const startButton = document.createElement('div');
    startButton.className = 'start-button';
    startButton.addEventListener('click', toggleStartMenu);
    taskbarLeft.appendChild(startButton);

    const windowButtons = document.createElement('div');
    windowButtons.className = 'window-buttons';
    windows.forEach(win => {
        const button = document.createElement('div');
        button.className = 'window-button';
        if (win === activeWindow) {
            button.classList.add('active');
        }
        button.textContent = win.title;
        button.onclick = () => {
            if (win.minimized) {
                win.minimized = false;
            }
            setActiveWindow(win);
        };
        windowButtons.appendChild(button);
    });
    taskbarLeft.appendChild(windowButtons);

    taskbar.appendChild(taskbarLeft);

    const taskbarRight = document.createElement('div');
    taskbarRight.className = 'taskbar-right';

    const clock = document.createElement('div');
    clock.className = 'clock';
    const updateClock = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateClock();
    setInterval(updateClock, 1000 * 60);
    taskbarRight.appendChild(clock);

    taskbar.appendChild(taskbarRight);
}

export { renderTaskbar };