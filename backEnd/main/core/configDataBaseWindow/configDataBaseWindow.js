let listenersCreated = false
let configDataBaseWindow

async function startConfigDataBaseWindow(store, serverWindow) {
    const { createWindow, loadUrl, createNewIpcMain } = require('../../helpers');
    if (!configDataBaseWindow) {
        configDataBaseWindow = createWindow({
            width: 300,
            height: 300,
            parent: serverWindow,
        })
        loadUrl(configDataBaseWindow, '/core/configDataBaseWindow/configDataBaseWindow')
    }

    function createListeners() {
        createNewIpcMain('configDataBase', (e, data) => {
            const { startServerWindow } = require('../serverWindow/serverWindow');
            store.set('configs', data)
            configDataBaseWindow.close()
            if (serverWindow) {
                const { startQuotationServer, closeQuotationServer } = require('../../server/quotationServer')
                closeQuotationServer(serverWindow)
                startQuotationServer(serverWindow, store)
            } else {
                startServerWindow(store)
            }
        }, configDataBaseWindow)
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    configDataBaseWindow.on('closed', () => {
        configDataBaseWindow = null
        listenersCreated = false
    })
}
export { startConfigDataBaseWindow }