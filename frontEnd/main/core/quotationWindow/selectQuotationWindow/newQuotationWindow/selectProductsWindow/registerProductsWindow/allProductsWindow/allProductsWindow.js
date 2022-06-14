let allProductsWindow
let listenersCreated = false
async function startAllProductsWindow(registerProductsWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../../../../helpers')

    if (!allProductsWindow) {
        allProductsWindow = await createWindow({
            width: 800,
            height: 600,
            modal: true,
            parent: registerProductsWindow,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProductsWindow/registerProductsWindow/allProductsWindow/allProductsWindow'
        loadUrl(allProductsWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestAllProductsOfAllProductsWindow', async(e) => {
                const port = store.get('port')
                const dataBaseAddress = store.get('dataBaseAddress')

                const axios = require('axios')
                const url = `http://${dataBaseAddress}:${port}/products`
                const allProducts = await axios.get(url)

                e.reply('sendAllProductsOfAllProductsWindow', allProducts.data)
            },
            allProductsWindow
        )
        createNewIpcMain('sendSelectedProduct', (e, selectedProduct) => {
                registerProductsWindow.webContents.send('sendProduct', selectedProduct)
                allProductsWindow.close()
            },
            allProductsWindow
        )
        createNewIpcMain('closeAllProductsWindow',
            () => allProductsWindow.close(),
            allProductsWindow
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    allProductsWindow.on('closed', () => {
        listenersCreated = false
        allProductsWindow = null
    })
    allProductsWindow.on('close', () => {
        registerProductsWindow.focus()
    })
}
export { startAllProductsWindow }