import { createWindow } from '../core/windowManager.js';

function contactApp() {
    createWindow("Contact", "src/apps/html/contact.html", '../../icons/Email.png');
}

export { contactApp };