// Core App Registry: Manages registration and loading of applications.

const apps = new Map();

function registerApp(name, icon, launchFunction) {
    apps.set(name, {
        name,
        icon,
        launch: launchFunction,
    });
}

function loadApp(name) {
    const app = apps.get(name);
    if (app && app.launch) {
        app.launch();
    } else {
        console.error(`App "${name}" not found or has no launch function.`);
    }
}

export { registerApp, loadApp, apps };