import { BrowserWindow } from 'electron';

export default function createWindow(options) {
    const isProd = process.env.NODE_ENV === 'production';
    const win = new BrowserWindow({
        ...options,
        center: true,
        autoHideMenuBar: true,
        webPreferences: {
            devTools: !isProd,
            nodeIntegration: true,
            contextIsolation: false,
            ...options.webPreferences,
        },
    });

    return win;
};