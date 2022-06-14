let selectQuotationWindow
let listenersCreated = false
async function startSelectQuotationWindow(mainWindowOfQuotation, store) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require("../../../helpers")

    if (!selectQuotationWindow) {
        selectQuotationWindow = createWindow({
            width: 427,
            height: 473,
            maximizable: false,
            parent: mainWindowOfQuotation
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/selectQuotationWindow'
        loadUrl(selectQuotationWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestAllOpenedQuotations',
            async e => {
                const { processData } = require('./processDataOfSelectQuotationWindow')
                processData(selectQuotationWindow, store)
            },
            selectQuotationWindow
        )
        createNewIpcMain('openNewQuotationWindow',
            (e) => {
                const { startNewQuotationWindow } = require('./newQuotationWindow/newQuotationWindow')
                startNewQuotationWindow(selectQuotationWindow, store)
            },
            selectQuotationWindow
        )
        createNewIpcMain('sendSelectedQuotation',
            (e, selectedQuotation) => {
                store.set('selectedQuotation', selectedQuotation)
                const { processData } = require('../processDataOfMainWindowOfQuotation')
                processData(mainWindowOfQuotation, store)

                selectQuotationWindow.close()
            },
            selectQuotationWindow
        )
        createNewIpcMain('closeSelectQuotationWindow',
            () => selectQuotationWindow.close(),
            selectQuotationWindow
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    registerShortcut(selectQuotationWindow, 'alt+c', () => {
        selectQuotationWindow.webContents.send('requestSendSelectedQuotation')
    })
    registerShortcut(selectQuotationWindow, 'alt+n', () => {
        const { startNewQuotationWindow } = require('./newQuotationWindow/newQuotationWindow')
        startNewQuotationWindow(selectQuotationWindow, store)
    })

    selectQuotationWindow.on('closed', () => {
        listenersCreated = false
        selectQuotationWindow = null
    })
    selectQuotationWindow.on('close', () => {
        mainWindowOfQuotation.focus()
    })
}
export { startSelectQuotationWindow }