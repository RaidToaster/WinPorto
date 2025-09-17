import { createWindow } from '../core/windowManager.js';

function contactApp() {
    createWindow("Contact", (contentArea) => {
        contentArea.innerHTML = `
            <div class="padded-content">
                <h3>Contact Me</h3>
                <form>
                    <label for="name">Name:</label><br>
                    <input type="text" id="name" name="name"><br>
                    <label for="email">Email:</label><br>
                    <input type="email" id="email" name="email"><br>
                    <label for="message">Message:</label><br>
                    <textarea id="message" name="message" rows="4" class="full-width-textarea"></textarea><br><br>
                    <input type="submit" value="Submit">
                </form>
            </div>
        `;
    }, '../../icons/Email.png');
}

export { contactApp };