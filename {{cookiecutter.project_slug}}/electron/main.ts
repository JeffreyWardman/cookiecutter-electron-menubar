import { app, BrowserWindow } from "electron";
import { is } from "electron-util";
import path from "path";
import { TrayGenerator } from "../src/TrayGenerator";
const Store = require("electron-store");

const schema = {
  launchAtStart: true
};

const store = new Store(schema);
let mainWindow: BrowserWindow | null = null;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 350,
    backgroundColor: "rgba(255, 255, 255)",
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (is.development) {
    console.log("Running in development mode");
    mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    console.log("Running in production mode");
    mainWindow.loadFile(path.join(process.resourcesPath, `app/.vite/renderer/main_window/index.html`));
  }
};

app.on("ready", () => {
  createMainWindow();
  const Tray = new TrayGenerator(mainWindow, store);
  Tray.createTray();
});

app.dock.hide();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.setLoginItemSettings({
  openAtLogin: store.get("launchAtStart")
});

app.on("will-quit", () => {});
