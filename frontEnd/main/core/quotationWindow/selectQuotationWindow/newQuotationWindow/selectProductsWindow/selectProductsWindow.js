let selectProductsWindow
let listenersCreated = false
async function openSelectProductsWindow(newQuotationWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../../../../helpers')

    if (!selectProductsWindow) {
        selectProductsWindow = await createWindow({

            width: 800,
            height: 600,
            parent: newQuotationWindow,
            modal: true,
            maximizable: false,
        })

        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProductsWindow/selectProductsWindow'
        loadUrl(selectProductsWindow, urlOfPage)
    }

    let selectedProducts = []

    function createListeners() {
        createNewIpcMain('requestAllProducts',
            async(e) => {
                console.log('a')
                const { processData } = require('./processDataOfSelectProducts')
                processData(selectProductsWindow, store)
            },
            selectProductsWindow
        )
        createNewIpcMain('sendSelectedProducts',
            (e, data) => selectedProducts = data,
            selectProductsWindow
        )
        createNewIpcMain('openRegisterProductsWindow',
            e => {
                const { startRegisterProductsWindow } = require('./registerProductsWindow/registerProductsWindow')
                startRegisterProductsWindow(selectProductsWindow, store)
            },
            selectProductsWindow
        )
        createNewIpcMain('closeSelectProductsWindow',
            e => selectProductsWindow.close(),
            selectProductsWindow
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    registerShortcut(selectProductsWindow, 'alt+c', () => {
        const { startRegisterProductsWindow } = require('./registerProductsWindow/registerProductsWindow')
        startRegisterProductsWindow(selectProductsWindow, store)
        selectProductsWindow.webContents.send('shortcutRemove')
    })

    selectProductsWindow.on('closed', () => {
        const { processData } = require('../processDataOfNewQuotationWindow')
        processData(newQuotationWindow, selectedProducts, null, store)

        listenersCreated = false
        selectProductsWindow = null
    })
    selectProductsWindow.on('close', () => {
        newQuotationWindow.focus()
    })
}
export { openSelectProductsWindow }