import { nativeImage } from "electron";

const { Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");
const { Store } = require("electron-store");

export class TrayGenerator {
  private tray: Tray | null = null;
  private store: Store;
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow, store: Store) {
    this.tray = null;
    this.store = store;
    this.mainWindow = mainWindow;
  }

  getWindowPosition = (): { x: number; y: number } => {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    const y = Math.round(trayBounds.y + trayBounds.height);
    return { x, y };
  };

  showWindow = (): void => {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.focus();
    this.mainWindow.setVisibleOnAllWorkspaces(false);
  };
  toggleWindow = (): void => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  };

  rightClickMenu = (): void => {
    const menu: Electron.MenuItemConstructorOptions[] = [
      {
        label: "Launch at startup",
        type: "checkbox",
        checked: this.store.get("launchAtStart"),
        click: (event): void => this.store.set("launchAtStart", event.checked)
      },
      {
        role: "quit",
        accelerator: "Command+Q"
      }
    ];
    this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
  };

  createTray = (): void => {
    this.tray = new Tray(nativeImage.createEmpty());

    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on("click", this.toggleWindow);
    this.tray.on("right-click", this.rightClickMenu);

    this.tray.setImage(path.join(__dirname, "../../src/assets/TrayIcon.png"));
  };
}
