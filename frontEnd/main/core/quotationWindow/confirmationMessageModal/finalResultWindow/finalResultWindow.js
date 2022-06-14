let finalResultWindow
let listenersStarted = false

function startFinalResultWindow(mainWindowOfQuotation, store) {

    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../helpers');

    if (!finalResultWindow) {
        finalResultWindow = createWindow({
            width: 800,
            height: 600,
            minimizable: false,
            parent: mainWindowOfQuotation,
        })
        const urlOfPage = '/core/quotationWindow/confirmationMessageModal/finalResultWindow/finalResultWindow'
        loadUrl(finalResultWindow, urlOfPage)

        finalResultWindow.on('ready-to-show', () => finalResultWindow.maximize())
    }

    function createListeners() {
        createNewIpcMain('requestDataOfFinalResult',
            e => {
                const { processData } = require('./processDataOfFinalResultWindow')
                processData(finalResultWindow, store)
            },
            finalResultWindow
        )
        createNewIpcMain('closeFinalResultWindow',
            () => finalResultWindow.close(),
            finalResultWindow
        )
        listenersStarted = true
    }
    if (!listenersStarted) createListeners()

    finalResultWindow.on('closed', () => {
        finalResultWindow = null
        listenersStarted = false
    })
    finalResultWindow.on('close', () => {
        mainWindowOfQuotation.focus()
    })

}
export { startFinalResultWindow }