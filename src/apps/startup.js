import { createWindow } from '../core/windowManager.js';

function startupApp() {
    const startupWindow = createWindow("Welcome", "src/apps/html/startupModal.html", 'Windows XP Icons/Help and Support.png', 'welcome');

}

export { startupApp };