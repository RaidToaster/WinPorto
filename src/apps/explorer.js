import { createWindow } from '../core/windowManager.js';

function getIconForFileType(type) {
    switch (type) {
        case 'pdf':
            return '../../Windows XP Icons/Adobe Acrobat Reader 7.0.png';
        case 'docx':
            return '../../Windows XP Icons/Microsoft Office Word 2003.png';
        case 'png':
        case 'jpg':
            return '../../Windows XP Icons/Microsoft Office Picture Manager.png';
        default:
            return '../../Windows XP Icons/Generic Document.png';
    }
}

function explorerApp() {
    createWindow("Explorer", (contentArea) => {
        const explorerEl = document.createElement('div');
        explorerEl.className = 'explorer-container';

        // Create XP-Style Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'explorer-toolbar';
        toolbar.innerHTML = `
            <div class="toolbar-buttons">
                <button class="toolbar-button"><img src="../../Windows XP Icons/Back.png" alt="Back"> Back</button>
                <button class="toolbar-button"><img src="../../Windows XP Icons/Forward.png" alt="Forward"> Forward</button>
                <button class="toolbar-button"><img src="../../Windows XP Icons/Up.png" alt="Up"> Up</button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-button"><img src="../../Windows XP Icons/Search.png" alt="Search"> Search</button>
                <button class="toolbar-button"><img src="../../Windows XP Icons/Folder View.png" alt="Folders"> Folders</button>
            </div>
            <div class="address-bar-container">
                <label for="address-bar">Address</label>
                <input type="text" id="address-bar" class="address-bar" value="My Computer">
            </div>
        `;

        const mainArea = document.createElement('div');
        mainArea.className = 'explorer-main-area';

        // Create Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'explorer-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-panel">
                <div class="sidebar-header">System Tasks</div>
                <div class="sidebar-content">
                    <a><img src="../../Windows XP Icons/Help and Support.png" class="icon-sm"> View system information</a>
                    <a><img src="../../Windows XP Icons/Add New Programs.png" class="icon-sm"> Add or remove programs</a>
                    <a><img src="../../Windows XP Icons/Control Panel.png" class="icon-sm"> Change a setting</a>
                </div>
            </div>
            <div class="sidebar-panel">
                <div class="sidebar-header">Other Places</div>
                <div class="sidebar-content">
                    <a><img src="../../Windows XP Icons/My Network Places.png" class="icon-sm"> My Network Places</a>
                    <a><img src="../../Windows XP Icons/My Documents.png" class="icon-sm"> My Documents</a>
                    <a><img src="../../Windows XP Icons/Shared Documents.png" class="icon-sm"> Shared Documents</a>
                    <a><img src="../../Windows XP Icons/Control Panel.png" class="icon-sm"> Control Panel</a>
                </div>
            </div>
            <div class="sidebar-panel">
                <div class="sidebar-header">Details</div>
                <div class="sidebar-content">
                    <p><img src="../../Windows XP Icons/Favorites.png" class="icon-sm"> Star icon + text about me</p>
                    <a href="#">Medium</a>
                    <a href="#">Minesweeper</a>
                </div>
            </div>
        `;

        // Create Main Content
        const mainContent = document.createElement('div');
        mainContent.className = 'explorer-main-content';
        mainContent.innerHTML = `
            <div class="content-section">
                <div class="section-title">Files Stored on This Computer</div>
                <div class="section-body">
                    <div class="item"><img src="../../Windows XP Icons/Shared Documents.png">Shared Documents</div>
                    <div class="item"><img src="../../Windows XP Icons/My Documents.png">User's Documents</div>
                </div>
            </div>
            <div class="content-section">
                <div class="section-title">Hard Disk Drives</div>
                <div class="section-body">
                    <div class="item"><img src="../../Windows XP Icons/Hard Drive.png">Local Disk (C:)</div>
                </div>
            </div>
            <div class="content-section">
                <div class="section-title">Devices with Removable Storage</div>
                <div class="section-body">
                    <div class="item"><img src="../../Windows XP Icons/CD-ROM.png">CD Drive (D:)</div>
                </div>
            </div>
            <div class="content-section">
                <div class="section-title">About Me :)</div>
                <div class="section-body">
                    <a href="https://github.com/your-github" target="_blank" class="item"><img src="../../Windows XP Icons/github.png">GitHub</a>
                    <a href="https://your-website.com" target="_blank" class="item"><img src="../../Windows XP Icons/doge.png">My Website (This One!)</a>
                </div>
            </div>
        `;

        mainArea.appendChild(sidebar);
        mainArea.appendChild(mainContent);

        explorerEl.appendChild(toolbar);
        explorerEl.appendChild(mainArea);
        contentArea.appendChild(explorerEl);

    }, '../../Windows XP Icons/My Computer.png');
}

export { explorerApp };