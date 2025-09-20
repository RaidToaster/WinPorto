// Core Window Manager: Manages all application windows, including their state, position, and rendering order.
import { renderTaskbar } from './taskbar.js';
import { throttle } from './utils.js';

const windows = [];
let activeWindow = null;
let nextWindowId = 1;
let zIndexCounter = 0;
const windowContainer = document.getElementById('window-container');

function createWindow(title, content, iconUrl, windowClass = '') {
    const windowEl = document.createElement('div');
    windowEl.className = `window ${windowClass}`.trim();

    // Mobile-responsive positioning
    const isMobile = window.innerWidth <= 768;
    const baseOffset = isMobile ? 10 : 50;
    const spacing = isMobile ? 15 : 30;

    windowEl.style.left = `${baseOffset + (windows.length % 10) * spacing}px`;
    windowEl.style.top = `${baseOffset + (windows.length % 10) * spacing}px`;

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
    minButton.innerHTML = '<img src="../../Windows XP Icons/Minimize.png" alt="Minimize">';

    const maxButton = document.createElement('button');
    maxButton.className = 'title-button';
    maxButton.innerHTML = '<img src="../../Windows XP Icons/Maximize.png" alt="Maximize">';

    const closeButton = document.createElement('button');
    closeButton.className = 'title-button';
    closeButton.innerHTML = '<img src="../../Windows XP Icons/Exit.png" alt="Close">';

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

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);

        const onMouseMove = throttle(function (e) {
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
        }, 16);

        function onMouseUp() {
            isDragging = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';

    if (typeof content === 'string') {
        const iframe = document.createElement('iframe');
        iframe.src = content;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        contentArea.appendChild(iframe);
    } else if (typeof content === 'function') {
        content(contentArea);
    }

    windowEl.appendChild(titleBar);
    windowEl.appendChild(contentArea);
    windowContainer.appendChild(windowEl);

    const newWindow = {
        id: nextWindowId++,
        title,
        el: windowEl,
        contentArea,
        content,
        iconUrl,
        minimized: false,
    };

    contentArea.addEventListener('mousedown', () => setActiveWindow(newWindow));

    windows.push(newWindow);
    setActiveWindow(newWindow);
    renderTaskbar();

    minButton.onclick = (e) => {
        e.stopPropagation();
        minimizeWindow(newWindow);
    };

    maxButton.onclick = (e) => {
        e.stopPropagation();
        maximizeWindow(newWindow);
    };

    closeButton.onclick = (e) => {
        e.stopPropagation();
        closeWindow(newWindow);
    };

    // Bottom-right corner resize (diagonal)
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

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);
        const onMouseMove = throttle((e) => {
            if (isResizing) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const isMobile = window.innerWidth <= 768;
                const minWidth = isMobile ? 250 : 200;
                const minHeight = isMobile ? 180 : 150;
                let newWidth = Math.max(minWidth, startWidth + deltaX);
                let newHeight = Math.max(minHeight, startHeight + deltaY);
                const containerRect = windowContainer.getBoundingClientRect();
                const maxWidth = containerRect.width - currentLeft;
                const maxHeight = containerRect.height - currentTop;
                newWidth = Math.min(newWidth, maxWidth);
                newHeight = Math.min(newHeight, maxHeight);
                windowEl.style.width = `${newWidth}px`;
                windowEl.style.height = `${newHeight}px`;
            }
        }, 16);
        const onMouseUp = () => {
            isResizing = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeHandle);

    // Left side resize (horizontal)
    const resizeLeft = document.createElement('div');
    resizeLeft.className = 'resize-left';
    resizeLeft.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let isResizing = true;
        const startX = e.clientX;
        const currentLeft = parseFloat(windowEl.style.left) || 0;
        const startWidth = windowEl.offsetWidth;

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);
        const onMouseMove = throttle((e) => {
            if (isResizing) {
                const deltaX = startX - e.clientX; // Reverse for left side
                const isMobile = window.innerWidth <= 768;
                const minWidth = isMobile ? 250 : 200;
                let newWidth = Math.max(minWidth, startWidth + deltaX);
                let newLeft = currentLeft + (startWidth - newWidth);
                const containerRect = windowContainer.getBoundingClientRect();
                newLeft = Math.max(0, Math.min(newLeft, containerRect.width - newWidth));
                newWidth = Math.min(newWidth, containerRect.width - newLeft);
                windowEl.style.width = `${newWidth}px`;
                windowEl.style.left = `${newLeft}px`;
            }
        }, 16);
        const onMouseUp = () => {
            isResizing = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeLeft);

    // Right side resize (horizontal)
    const resizeRight = document.createElement('div');
    resizeRight.className = 'resize-right';
    resizeRight.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let isResizing = true;
        const startX = e.clientX;
        const currentLeft = parseFloat(windowEl.style.left) || 0;
        const startWidth = windowEl.offsetWidth;

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);
        const onMouseMove = throttle((e) => {
            if (isResizing) {
                const deltaX = e.clientX - startX;
                const isMobile = window.innerWidth <= 768;
                const minWidth = isMobile ? 250 : 200;
                let newWidth = Math.max(minWidth, startWidth + deltaX);
                const containerRect = windowContainer.getBoundingClientRect();
                newWidth = Math.min(newWidth, containerRect.width - currentLeft);
                windowEl.style.width = `${newWidth}px`;
            }
        }, 16);
        const onMouseUp = () => {
            isResizing = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeRight);

    // Top side resize (vertical, below titlebar)
    const resizeTop = document.createElement('div');
    resizeTop.className = 'resize-top';
    resizeTop.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let isResizing = true;
        const startY = e.clientY;
        const currentTop = parseFloat(windowEl.style.top) || 0;
        const startHeight = windowEl.offsetHeight;

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);
        const onMouseMove = throttle((e) => {
            if (isResizing) {
                const deltaY = startY - e.clientY; // Reverse for top side
                const isMobile = window.innerWidth <= 768;
                const minHeight = isMobile ? 180 : 150;
                let newHeight = Math.max(minHeight, startHeight + deltaY);
                let newTop = currentTop + (startHeight - newHeight);
                const containerRect = windowContainer.getBoundingClientRect();
                newTop = Math.max(0, Math.min(newTop, containerRect.height - newHeight));
                newHeight = Math.min(newHeight, containerRect.height - newTop);
                windowEl.style.height = `${newHeight}px`;
                windowEl.style.top = `${newTop}px`;
            }
        }, 16);
        const onMouseUp = () => {
            isResizing = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeTop);

    // Bottom side resize (vertical)
    const resizeBottom = document.createElement('div');
    resizeBottom.className = 'resize-bottom';
    resizeBottom.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        let isResizing = true;
        const startY = e.clientY;
        const currentTop = parseFloat(windowEl.style.top) || 0;
        const startHeight = windowEl.offsetHeight;

        const shield = document.createElement('div');
        shield.className = 'shield';
        windowEl.appendChild(shield);

        setActiveWindow(newWindow);
        const onMouseMove = throttle((e) => {
            if (isResizing) {
                const deltaY = e.clientY - startY;
                const isMobile = window.innerWidth <= 768;
                const minHeight = isMobile ? 180 : 150;
                let newHeight = Math.max(minHeight, startHeight + deltaY);
                const containerRect = windowContainer.getBoundingClientRect();
                newHeight = Math.min(newHeight, containerRect.height - currentTop);
                windowEl.style.height = `${newHeight}px`;
            }
        }, 16);
        const onMouseUp = () => {
            isResizing = false;
            windowEl.removeChild(shield);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    windowEl.appendChild(resizeBottom);

    return newWindow;
}

function renderWindows() {
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
    renderTaskbar();
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
        win.el.style.left = '0px';
        win.el.style.top = '0px';
        win.el.style.width = '100%';
        win.el.style.height = '100%';
        win.maximized = true;
        // Update max button to restore icon if needed, but skipping for simplicity
    } else {
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