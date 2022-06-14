let newQuotationWindow
let listenersCreated = false
async function startNewQuotationWindow(selectQuotationWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../helpers')
    let selectedProducts = []
    let selectedProviders = []

    if (!newQuotationWindow) {
        newQuotationWindow = await createWindow({
            width: 1000,
            height: 660,
            maximizable: false,
            parent: selectQuotationWindow
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/newQuotationWindow'
        loadUrl(newQuotationWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestSelectedProductsAndSelectedProviders',
            (e) => {
                const { processData } = require('./processDataOfNewQuotationWindow')
                processData(newQuotationWindow, selectedProducts, selectedProviders, store)
            }, newQuotationWindow
        )
        createNewIpcMain('sendSelectedProducts',
            (e, data) => selectedProducts = data,
            newQuotationWindow
        )
        createNewIpcMain('sendSelectedProviders',
            (e, data) => selectedProviders = data,
            newQuotationWindow
        )
        createNewIpcMain('openSelectProductsWindow',
            e => {
                const { openSelectProductsWindow } = require('./selectProductsWindow/selectProductsWindow')
                openSelectProductsWindow(newQuotationWindow, store)
            },
            newQuotationWindow
        )
        createNewIpcMain('openSelectProvidersWindow',
            e => {
                const { openSelectProvidersWindow } = require('./selectProvidersWindow/selectProvidersWindow')
                openSelectProvidersWindow(newQuotationWindow, store)
            },
            newQuotationWindow
        )
        createNewIpcMain('closeNewQuotationWindow',
            () => {
                newQuotationWindow.close()
            },
            newQuotationWindow
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    newQuotationWindow.on('closed', () => {
        const { processData } = require('../processDataOfSelectQuotationWindow')
        processData(selectQuotationWindow, store)

        newQuotationWindow = null
        selectedProducts = []
        selectedProviders = []
        listenersCreated = false
    })
    newQuotationWindow.on('close', () => {
        selectQuotationWindow.focus()
    })

}
export { startNewQuotationWindow }