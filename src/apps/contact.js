import { createWindow } from '../core/windowManager.js';

function contactApp() {
    createWindow("Contact", (contentArea) => {
        contentArea.innerHTML = `<div style="padding: 10px;">Contact content will go here.</div>`;
    }, '../../icons/Email.png');
}

export { contactApp };