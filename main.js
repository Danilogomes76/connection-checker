const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");
const { getNetworksConnection } = require("./src/back-end/methods");
const notifier = require("node-notifier");

let appTray;

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

  win.on("ready-to-show", () => {

    notifier.notify({
      title: `Network Connection Checker`,
      message: `Programa aberto em segundo plano.`,
      icon: path.join(__dirname, "dist/assets/globo-terrestre.ico"),
    });
  });

  ipcMain.on("checkNetworks", async (event) => {
    const result = await getNetworksConnection();

    let messages = [];
    result.map((i) => {
      const key = Object.keys(i)[0];
      const value = Object.values(i);

      const message = `${key} - Offline\n`;

      if (value == "Offline") {
        messages.push(message);
      }
    });

    event.reply("networks", result);

    notifier.notify({
      title: `A redes que se encontram Offline.`,
      message: `${messages.join("")}\n`,
      icon: path.join(__dirname, "dist/assets/globo-terrestre.ico"),
    });
  });

  ipcMain.on("hideProgram", () => {
    win.hide();
  });

  const trayIconPath = path.join(__dirname, "dist/assets/globo-terrestre.ico");
  appTray = new Tray(trayIconPath);

  appTray.on("click", () => {
    win.show(); // Exibe a janela principal quando o ícone é clicado
  });
};

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
