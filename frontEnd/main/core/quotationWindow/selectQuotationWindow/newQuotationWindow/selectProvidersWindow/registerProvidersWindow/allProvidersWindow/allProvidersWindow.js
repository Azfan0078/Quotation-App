let allProvidersWindow
let listenersCreated = false

async function startAllProvidersWindow(registerProvidersWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../../../../helpers')

    if (!allProvidersWindow) {
        allProvidersWindow = await createWindow({
            width: 800,
            height: 600,
            modal: true,
            parent: registerProvidersWindow,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProvidersWindow/registerProvidersWindow/allProvidersWindow/allProvidersWindow'
        loadUrl(allProvidersWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestAllProvidersOfAllProvidersWindow', async(e) => {
                const port = store.get('port')
                const dataBaseAddress = store.get('dataBaseAddress')

                const axios = require('axios')
                const url = `http://${dataBaseAddress}:${port}/providers`
                const allProviders = await axios.get(url)

                e.reply('sendAllProvidersOfAllProvidersWindow', allProviders.data)
            },
            allProvidersWindow
        )
        createNewIpcMain('sendSelectedProvider', (e, selectedProvider) => {
                registerProvidersWindow.webContents.send('sendProvider', selectedProvider)
                allProvidersWindow.close()
            },
            allProvidersWindow
        )
        listenersCreated = true
        createNewIpcMain('closeAllProvidersWindow',
            () => allProvidersWindow.close(),
            allProvidersWindow
        )
    }
    if (!listenersCreated) createListeners()

    allProvidersWindow.on('closed', () => {
        listenersCreated = false
        allProvidersWindow = null
    })
    allProvidersWindow.on('close', () => {
        registerProvidersWindow.focus()
    })

}
export { startAllProvidersWindow }