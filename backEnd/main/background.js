import { app } from 'electron';
import serve from 'electron-serve';

import Store from 'electron-store'
const store = new Store()

const isProd = process.env.NODE_ENV === 'production';

let listenersCreated = false

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async() => {
    await app.whenReady();

    const configs = store.get('configs') || {}

    if (!configs.nameOfDataBase ||
        !configs.passwordOfDataBase ||
        !configs.port
    ) {
        const { startConfigDataBaseWindow } = require('./core/configDataBaseWindow/configDataBaseWindow');
        await startConfigDataBaseWindow(store)
    } else {
        const { startServerWindow } = require('./core/serverWindow/serverWindow')
        startServerWindow(store)
    }

    function createListeners() {
        const { createNewIpcMain } = require('./helpers')
        createNewIpcMain('requestConfigs', (e) => {
            const configs = store.get('configs')

            e.returnValue = configs
        })
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

})();

app.on('window-all-closed', () => {
    listenersCreated = false
    app.quit();
});