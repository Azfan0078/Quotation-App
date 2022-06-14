let registerProductsWindow
let listenersCreated = false

async function startRegisterProductsWindow(selectProductsWindow, store) {

    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../../../helpers')

    if (!registerProductsWindow) {
        registerProductsWindow = await createWindow({
            width: 800,
            height: 360,
            parent: selectProductsWindow,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProductsWindow/registerProductsWindow/registerProductsWindow'
        loadUrl(registerProductsWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestProducts',
            async(e) => {
                const port = store.get('port')
                const dataBaseAddress = store.get('dataBaseAddress')

                const axios = require('axios')

                const url = `http://${dataBaseAddress}:${port}/products`
                const products = await axios.get(url)

                e.returnValue = products.data
            },
            registerProductsWindow
        )
        createNewIpcMain('requestSelectedProduct',
            (e) => e.reply('sendProduct'),
            registerProductsWindow
        )
        createNewIpcMain('closeRegisterProductsWindow',
            () => registerProductsWindow.close(),
            registerProductsWindow
        )
        createNewIpcMain('openAllProductsWindow', () => {
                const { startAllProductsWindow } = require('./allProductsWindow/allProductsWindow')
                startAllProductsWindow(registerProductsWindow, store)
            },
            registerProductsWindow
        )
        createNewIpcMain('deleteProduct', async(e, productID) => {
                async function validateItemToBeDeleted() {
                    const port = store.get('port')
                    const dataBaseAddress = store.get('dataBaseAddress')

                    const axios = require('axios')

                    const reqOpenedQuotations = await axios.get(`http://${dataBaseAddress}:${port}/openedQuotations`)
                    const openedQuotations = reqOpenedQuotations.data

                    let validate = true
                    openedQuotations.forEach(openedQuotation => {
                        const selectedProductsIDs = openedQuotation.selectedProducts
                        const selectedProductsIDsArray = JSON.parse(selectedProductsIDs).split(',')
                        selectedProductsIDsArray.forEach(selectedProductID => {
                            if (selectedProductID == productID) {
                                validate = false
                            }
                        })
                    })
                    return validate
                }

                if (await validateItemToBeDeleted()) {

                    const { startConfirmationMessageModal } = require('./confirmationMessageModal/confirmationMessageModal')
                    startConfirmationMessageModal(productID, registerProductsWindow, store)

                } else {
                    registerProductsWindow.webContents.send('productInUsed', false)
                }
            },
            registerProductsWindow
        )
        listenersCreated = true
    }

    if (!listenersCreated) createListeners()

    registerProductsWindow.on('closed', () => {
        const { processData } = require('../processDataOfSelectProducts')
        processData(selectProductsWindow, store)
        registerProductsWindow = null

        listenersCreated = false
    })
    registerProductsWindow.on('close', () => {
        selectProductsWindow.focus()
    })
}
export { startRegisterProductsWindow }