function checkMouseCollision(mouseX, mouseY, elementX, elementY, elementWidth, elementHeight) {
    return (
        mouseX >= elementX &&
        mouseX <= elementX + elementWidth &&
        mouseY >= elementY &&
        mouseY <= elementY + elementHeight
    );
}

function createWindowTitleGradient(titleGradient) {
    titleGradient.addColorStop(0, 'rgb(0, 88, 238)');
    titleGradient.addColorStop(0.04, 'rgb(53, 147, 255)');
    titleGradient.addColorStop(0.06, 'rgb(40, 142, 255)');
    titleGradient.addColorStop(0.08, 'rgb(18, 125, 255)');
    titleGradient.addColorStop(0.10, 'rgb(3, 111, 252)');
    titleGradient.addColorStop(0.14, 'rgb(2, 98, 238)');
    titleGradient.addColorStop(0.20, 'rgb(0, 87, 229)');
    titleGradient.addColorStop(0.24, 'rgb(0, 84, 227)');
    titleGradient.addColorStop(0.56, 'rgb(0, 85, 235)');
    titleGradient.addColorStop(0.66, 'rgb(0, 91, 245)');
    titleGradient.addColorStop(0.76, 'rgb(2, 106, 254)');
    titleGradient.addColorStop(0.86, 'rgb(0, 98, 239)');
    titleGradient.addColorStop(0.92, 'rgb(0, 82, 214)');
    titleGradient.addColorStop(0.94, 'rgb(0, 64, 171)');
    titleGradient.addColorStop(1.00, 'rgb(0, 48, 146)');
}

function createWindowUnhighlightedGradient(titleGradient) {
    titleGradient.addColorStop(0, 'rgb(118, 151, 231)');
    titleGradient.addColorStop(0.03, 'rgb(126, 158, 227)');
    titleGradient.addColorStop(0.06, 'rgb(148, 175, 232)');
    titleGradient.addColorStop(0.08, 'rgb(151, 180, 233)');
    titleGradient.addColorStop(0.14, 'rgb(130, 165, 228)');
    titleGradient.addColorStop(0.17, 'rgb(124, 159, 226)');
    titleGradient.addColorStop(0.25, 'rgb(121, 150, 222)');
    titleGradient.addColorStop(0.56, 'rgb(123, 153, 225)');
    titleGradient.addColorStop(0.81, 'rgb(130, 169, 233)');
    titleGradient.addColorStop(0.89, 'rgb(128, 165, 231)');
    titleGradient.addColorStop(0.94, 'rgb(123, 150, 225)');
    titleGradient.addColorStop(0.97, 'rgb(122, 147, 223)');
    titleGradient.addColorStop(1.00, 'rgb(171, 186, 227)');
}
export { checkMouseCollision, createWindowTitleGradient, createWindowUnhighlightedGradient };