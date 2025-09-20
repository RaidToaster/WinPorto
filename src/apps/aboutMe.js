import { createWindow } from '../core/windowManager.js';

function aboutMeApp() {
    createWindow("About Me", "src/apps/html/aboutMe.html", '../../Windows XP Icons/User Accounts.png');
}

export { aboutMeApp };
