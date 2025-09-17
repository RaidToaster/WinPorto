// Core Window Manager: Manages all application windows, including their state, position, and rendering order.
import { renderTaskbar } from './taskbar.js';

const windows = [];
let activeWindow = null;
let nextWindowId = 1;
let zIndexCounter = 0;
const windowContainer = document.getElementById('window-container');

function createWindow(title, contentCallback, iconUrl) {
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.style.left = `${50 + (windows.length % 10) * 30}px`;
    windowEl.style.top = `${50 + (windows.length % 10) * 30}px`;

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';

    const titleText = document.createElement('span');
    titleText.className = 'title-text';
    titleText.textContent = title;

    if (iconUrl) {
        const icon = document.createElement('img');
        icon.src = iconUrl;
        icon.className = 'window-icon';
        titleBar.appendChild(icon);
        titleText.classList.add('has-icon');
    }

    const titleButtons = document.createElement('div');
    titleButtons.className = 'title-buttons';

    const minButton = document.createElement('button');
    minButton.className = 'title-button';
    minButton.innerHTML = '<img src="../../icons/Minimize.png" alt="Minimize">';
    minButton.onclick = (e) => {
        e.stopPropagation();
        minimizeWindow(newWindow);
    };

    const maxButton = document.createElement('button');
    maxButton.className = 'title-button';
    maxButton.innerHTML = '<img src="../../icons/Maximize.png" alt="Maximize">';
    maxButton.onclick = (e) => {
        e.stopPropagation();
        maximizeWindow(newWindow);
    };

    const closeButton = document.createElement('button');
    closeButton.className = 'title-button';
    closeButton.innerHTML = '<img src="../../icons/Exit.png" alt="Close">';
    closeButton.onclick = (e) => {
        e.stopPropagation();
        closeWindow(newWindow);
    };

    titleButtons.appendChild(minButton);
    titleButtons.appendChild(maxButton);
    titleButtons.appendChild(closeButton);

    if (!iconUrl) {
        titleText.classList.remove('has-icon');
    }
    titleBar.appendChild(titleText);
    titleBar.appendChild(titleButtons);

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.title-button')) return;

        let isDragging = true;
        const offsetX = e.clientX - windowEl.offsetLeft;
        const offsetY = e.clientY - windowEl.offsetTop;

        setActiveWindow(newWindow);

        function onMouseMove(e) {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Clamp position to stay within the window container
                const containerRect = windowContainer.getBoundingClientRect();
                newLeft = Math.max(0, Math.min(newLeft, containerRect.width - windowEl.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, containerRect.height - windowEl.offsetHeight));

                windowEl.style.left = `${newLeft}px`;
                windowEl.style.top = `${newTop}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

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
    
    contentArea.addEventListener('mousedown', () => setActiveWindow(newWindow));
    
    windows.push(newWindow);
    setActiveWindow(newWindow);

    if (contentCallback) {
        contentCallback(contentArea, newWindow);
    }
    
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let isResizing = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const currentLeft = parseFloat(windowEl.style.left) || 0;
        const currentTop = parseFloat(windowEl.style.top) || 0;
        const startWidth = windowEl.offsetWidth;
        const startHeight = windowEl.offsetHeight;
        setActiveWindow(newWindow);
        const onMouseMove = (e) => {
            if (isResizing) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                let newWidth = Math.max(200, startWidth + deltaX);
                let newHeight = Math.max(150, startHeight + deltaY);
                const containerRect = windowContainer.getBoundingClientRect();
                const maxWidth = containerRect.width - currentLeft;
                const maxHeight = containerRect.height - currentTop;
                newWidth = Math.min(newWidth, maxWidth);
                newHeight = Math.min(newHeight, maxHeight);
                windowEl.style.width = `${newWidth}px`;
                windowEl.style.height = `${newHeight}px`;
            }
        };
        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeHandle);
    
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
        activeWindow.el.style.zIndex = ++zIndexCounter;
        // Bring to front
        windowContainer.appendChild(activeWindow.el);
    }
    renderWindows();
}

function minimizeWindow(win) {
    win.minimized = true;
    win.el.classList.add('minimized');
    renderTaskbar();
}

function maximizeWindow(win) {
    if (!win.maximized) {
        win.originalLeft = getComputedStyle(win.el).left;
        win.originalTop = getComputedStyle(win.el).top;
        win.originalWidth = getComputedStyle(win.el).width;
        win.originalHeight = getComputedStyle(win.el).height;
        win.el.classList.add('maximized');
        win.maximized = true;
        // Update max button to restore icon if needed, but skipping for simplicity
    } else {
        win.el.classList.remove('maximized');
        win.el.style.left = win.originalLeft;
        win.el.style.top = win.originalTop;
        win.el.style.width = win.originalWidth;
        win.el.style.height = win.originalHeight;
        win.maximized = false;
    }
    setActiveWindow(win);
}

function closeWindow(win) {
    win.el.remove();
    const index = windows.indexOf(win);
    if (index > -1) {
        windows.splice(index, 1);
    }
    if (activeWindow === win) {
        activeWindow = null;
    }
    renderTaskbar();
}

export { createWindow, renderWindows, windows, activeWindow, closeAll, setActiveWindow, minimizeWindow, maximizeWindow, closeWindow };