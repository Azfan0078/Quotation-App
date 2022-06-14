let selectProvidersWindow
let listenersCreated = false
async function openSelectProvidersWindow(newQuotationWindow, store, ) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../../../../helpers')

    if (!selectProvidersWindow) {
        selectProvidersWindow = await createWindow({
            width: 800,
            height: 600,
            parent: newQuotationWindow,
            modal: true,
            maximizable: false,

        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProvidersWindow/selectProvidersWindow'
        loadUrl(selectProvidersWindow, urlOfPage)
    }

    let selectedProviders = []

    function createListeners() {
        createNewIpcMain('requestAllProviders',
            async(e) => {
                const { processData } = require('./processDataOfSelectProvidersWindow')
                processData(selectProvidersWindow, store)
            },
            selectProvidersWindow
        )
        createNewIpcMain('sendSelectedProviders',
            (e, data) => selectedProviders = data,
            selectProvidersWindow
        )
        createNewIpcMain('openRegisterProvidersWindow',
            e => {
                const { startRegisterProvidersWindow } = require('./registerProvidersWindow/registerProvidersWindow')
                startRegisterProvidersWindow(selectProvidersWindow, store)
            },
            selectProvidersWindow
        )
        createNewIpcMain('closeSelectProvidersWindow',
            e => selectProvidersWindow.close(),
            selectProvidersWindow
        )
        listenersCreated = true
    }

    if (!listenersCreated) createListeners()

    registerShortcut(selectProvidersWindow, 'alt+c', () => {
        const { startRegisterProvidersWindow } = require('./registerProvidersWindow/registerProvidersWindow')
        startRegisterProvidersWindow(selectProvidersWindow, store)
        selectProvidersWindow.webContents.send('shortcutRemove')
    })

    selectProvidersWindow.on('closed', () => {
        const { processData } = require('../processDataOfNewQuotationWindow')
        processData(newQuotationWindow, null, selectedProviders, store)

        listenersCreated = false

        selectProvidersWindow = null
    })
    selectProvidersWindow.on('close', () => {
        newQuotationWindow.focus()
    })
}
export { openSelectProvidersWindow }