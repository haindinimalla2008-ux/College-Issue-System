const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile(
        path.join(__dirname, "frontend", "home.html")
    );
}


app.whenReady().then(() => {

    backendProcess = spawn(
        "node",
        [
            path.join(
                __dirname,
                "backend",
                "server.js"
            )
        ],
        {
            shell: true
        }
    );


    backendProcess.stdout.on(
        "data",
        (data) => {
            console.log(
                `Backend: ${data}`
            );
        }
    );


    backendProcess.stderr.on(
        "data",
        (data) => {
            console.error(
                `Backend Error: ${data}`
            );
        }
    );


    createWindow();

});


app.on("window-all-closed", () => {

    if (backendProcess) {
        backendProcess.kill();
    }

    if (process.platform !== "darwin") {
        app.quit();
    }

});