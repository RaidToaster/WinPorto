// Core Window Manager: Manages all application windows, including their state, position, and rendering order.

const windows = [];
let activeWindow = null;
let nextWindowId = 1;
const windowContainer = document.getElementById('window-container');

function createWindow(title, contentCallback, iconUrl) {
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.style.left = `${50 + (windows.length % 10) * 30}px`;
    windowEl.style.top = `${50 + (windows.length % 10) * 30}px`;

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    titleBar.textContent = title;

    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';

    windowEl.appendChild(titleBar);
    windowEl.appendChild(contentArea);
    windowContainer.appendChild(windowEl);

    const newWindow = {
        id: nextWindowId++,
        title,
        el: windowEl,
        contentArea,
        contentCallback,
        minimized: false,
    };

    windows.push(newWindow);
    setActiveWindow(newWindow);

    if (contentCallback) {
        contentCallback(contentArea, newWindow);
    }

    return newWindow;
}

function renderWindows() {
    // This function is now largely obsolete as rendering is handled by the DOM.
    // We might keep it for updating window states (e.g., active status).
    windows.forEach(win => {
        if (win === activeWindow) {
            win.el.classList.add('active');
        } else {
            win.el.classList.remove('active');
        }
    });
}

function closeAll() {
    windows.forEach(win => win.el.remove());
    windows.length = 0;
    activeWindow = null;
}

function setActiveWindow(win) {
    if (activeWindow) {
        activeWindow.el.classList.remove('active');
    }
    activeWindow = win;
    if (activeWindow) {
        activeWindow.el.classList.add('active');
        // Bring to front
        windowContainer.appendChild(activeWindow.el);
    }
    renderWindows();
}

export { createWindow, renderWindows, windows, activeWindow, closeAll, setActiveWindow };