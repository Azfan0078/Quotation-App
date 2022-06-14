let mainWindowOfQuotation
let listenersCreated = false
async function startMainWindowOfQuotation(store) {

    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../helpers');

    if (!mainWindowOfQuotation) {
        mainWindowOfQuotation = createWindow({
            width: 1600,
            height: 900
        })
        const urlOfPage = '/core/quotationWindow/quotationWindow'
        loadUrl(mainWindowOfQuotation, urlOfPage)
        mainWindowOfQuotation.on('ready-to-show', () => mainWindowOfQuotation.maximize())
    }

    function createListeners() {
        createNewIpcMain('requestProductsAndProviders',
            async e => { e.returnValue = allProductsAndAllProviders },
            mainWindowOfQuotation
        )

        createNewIpcMain('requestSelectedQuotation',
            e => {
                const { processData } = require('./processDataOfMainWindowOfQuotation')
                processData(mainWindowOfQuotation, store)
            },
            mainWindowOfQuotation
        )

        createNewIpcMain('openSelectQuotationWindow',
            e => {
                const { startSelectQuotationWindow } = require('./selectQuotationWindow/selectQuotationWindow');
                startSelectQuotationWindow(mainWindowOfQuotation, store)
            },
            mainWindowOfQuotation
        )

        createNewIpcMain('finalizeQuotation',
            (e, data) => {
                const { startConfirmationMessageModal } = require('./confirmationMessageModal/confirmationMessageModal');
                startConfirmationMessageModal(data, mainWindowOfQuotation, store)
            },
            mainWindowOfQuotation
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    registerShortcut(mainWindowOfQuotation, 'alt+f', () => {
        mainWindowOfQuotation.webContents.send('requestFinalizeQuotation')
    })
    registerShortcut(mainWindowOfQuotation, 'alt+s', () => {
        const { startSelectQuotationWindow } = require('./selectQuotationWindow/selectQuotationWindow');
        startSelectQuotationWindow(mainWindowOfQuotation, store)
    })

    mainWindowOfQuotation.on('closed', () => {
        listenersCreated = false
        mainWindowOfQuotation = null
    })

}
export { startMainWindowOfQuotation }