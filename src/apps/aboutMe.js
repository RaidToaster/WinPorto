import { createWindow } from '../core/windowManager.js';
function aboutMeApp() {
    createWindow("About Me", (contentArea) => {
        contentArea.innerHTML = `
            <textarea class="about-me-textarea" readonly>
Hello! I'm a passionate software developer with expertise in creating interactive web experiences.

My skills include JavaScript, HTML5, CSS3, and responsive UI design. I enjoy solving complex problems and building applications that delight users.

When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.
            </textarea>
        `;
    }, '../../icons/User Accounts.png');
}

export { aboutMeApp };