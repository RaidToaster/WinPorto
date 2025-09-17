import { createWindow } from '../core/windowManager.js';
function aboutMeApp() {
    createWindow("About Me", (contentArea) => {
        contentArea.innerHTML = `
            <div style="padding: 10px;">
                <p>Hello! I'm a passionate software developer with expertise in creating interactive web experiences.</p>
                <p>My skills include JavaScript, HTML5, CSS3, and responsive UI design. I enjoy solving complex problems and building applications that delight users.</p>
                <p>When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.</p>
            </div>
        `;
    }, '../../icons/User Accounts.png');
}

export { aboutMeApp };