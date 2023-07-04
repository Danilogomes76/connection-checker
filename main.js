const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");
const { getNetworksConnection } = require("./src/back-end/methods");
const notifier = require("node-notifier");
const { appRunInSecondPlan, networkConnections } = require("./src/back-end/notifications");

const iconDir = 'dist/assets/globo-terrestre.ico'

let appTray;

const isDev =
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV == "development"
    ? true
    : false;


const isMac = process.platform === "darwin" ? true : false;


const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1500 : 500,
    height: isDev ? 600 : 630,
    resizable: isDev ? true : false,
    backgroundColor: "#d7cd7a",
    icon: path.join(__dirname, iconDir),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  
  win.loadFile("./src/index.html");

  
  
  
  if (isDev) {
    win.webContents.openDevTools();
  }

  
  
  
  
  win.on("ready-to-show", () => {
    notifier.notify(appRunInSecondPlan());
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

    notifier.notify(networkConnections(messages));
  });

  
  ipcMain.on("hideProgram", () => {
    win.hide();
  });

  const trayIconPath = path.join(__dirname, iconDir);
  appTray = new Tray(trayIconPath);

  appTray.on("click", () => {
    win.show(); 
  });
};

app.whenReady().then(() => {
  createWindow();
});


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
