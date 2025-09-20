import { createWindow } from '../core/windowManager.js';

function contactApp() {
    createWindow("Contact", "src/apps/html/contact.html", '../../Windows XP Icons/Email.png');
}

export { contactApp };