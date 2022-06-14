let serverWindow

let listenersCreated = false
async function startServerWindow(store) {
    const { startQuotationServer } = require('../../server/quotationServer')
    const { createWindow, loadUrl, createNewIpcMain } = require('../../helpers');

    if (!serverWindow) {
        serverWindow = createWindow({
            width: 800,
            height: 600,
        })
        loadUrl(serverWindow, '/core/serverWindow/serverWindow')
    }

    startQuotationServer(serverWindow, store)

    function createListeners() {
        createNewIpcMain('openConfigDataBaseWindow', () => {
                const { startConfigDataBaseWindow } = require('../configDataBaseWindow/configDataBaseWindow')
                startConfigDataBaseWindow(store, serverWindow)
            },
            serverWindow
        )
        createNewIpcMain('openDeveloperFunctions', () => {
                const { startDeveloperFunctionsWindow } = require("../developerFunctionsWindow/developerFunctionsWindow")
                startDeveloperFunctionsWindow(store, serverWindow)
            },
            serverWindow
        )

        listenersCreated = true
    }

    if (!listenersCreated) createListeners()

    serverWindow.on('close', () => {
        serverWindow = null
        listenersCreated = false
    })
}
export { startServerWindow }