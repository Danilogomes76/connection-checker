const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { getNetworksConnection } = require("./src/back-end/methods");

const isDev =
    process.env.NODE_ENV !== undefined && process.env.NODE_ENV == "development"
        ? true
        : false;

// Checa a plataforma, se esta em macOs.
const isMac = process.platform === "darwin" ? true : false;

const createWindow = () => {
    const win = new BrowserWindow({
        width: isDev ? 1500 : 500,
        height: isDev ? 600 : 630,
        resizable: isDev ? true : false,
        backgroundColor: "#44475a",
        icon: path.join(__dirname, "dist/assets/globo-terrestre.ico"),
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    //Carrega o index.html, onde esta o conteudo da aplicação
    win.loadFile("./src/index.html");

    //Caso esteja em ambiente de desenvolvimento ele abre o devTools.
    //Foi criado um script no package.json chamado 'start:dev' que
    //seta o ambiente para desenvolvimento.
    if (isDev) {
        win.webContents.openDevTools();
    }

    // No objeto Win foi definido a propriedade show como false, pois ao
    // iniciar a aplicação tinha um delay de alguns ms para carregar a página html,
    // o win.show com o event "ready-to-show" executa somente quando a pagina esta pronta.
    win.once("ready-to-show", () => {
        win.show();
    })

    ipcMain.on("checkNetworks", async (event) => {
        const result = await getNetworksConnection()

        // win.webContents.send('networks', result)
        event.reply('networks', result)
    });
}

app.whenReady().then(() => {
    createWindow();
});

//Problema que tem em mac que não fecha as abas e meio que minimiliza elas.
app.on("window-all-closed", () => {
    if (!isMac) {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});