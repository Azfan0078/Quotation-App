import { app, ipcMain } from 'electron';
import serve from 'electron-serve';

import Store from 'electron-store'
const store = new Store()

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async() => {
    await app.whenReady();

    let port = store.get('port')
    let dataBaseAddress = store.get('dataBaseAddress')

    try {
        const { startMainWindowOfQuotation } = require('./core/quotationWindow/quotationWindow')

        const axios = require('axios');
        await axios.get(`http://${dataBaseAddress}:${port}/verifyConnection`)

        startMainWindowOfQuotation(store)

    } catch (err) {
        if (!isProd) console.log(err)

        const { startConnectionFailWindow } = require('./connectionFailWindow/connectionFailWindow');
        startConnectionFailWindow(store)
    }
    const { createNewIpcMain } = require('./helpers');
    ipcMain.on('refreshDataBaseAddressAndPort', () => {
        ipcMain.removeAllListeners('reqDataBaseAddressAndPort')
        let port = store.get('port')
        let dataBaseAddress = store.get('dataBaseAddress')
        createNewIpcMain('reqDataBaseAddressAndPort', e => e.returnValue = { dataBaseAddress, port })
    })
    createNewIpcMain('reqDataBaseAddressAndPort', e => e.returnValue = { dataBaseAddress, port })

})();

app.on('window-all-closed', () => {
    app.quit();
});