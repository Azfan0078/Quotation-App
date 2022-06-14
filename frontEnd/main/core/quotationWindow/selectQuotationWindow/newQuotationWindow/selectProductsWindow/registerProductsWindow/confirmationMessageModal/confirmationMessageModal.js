let confirmationMessageModal
let listenersCreated = false

function startConfirmationMessageModal(productID, registerProductsWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../../../../../../helpers');

    if (!confirmationMessageModal) {
        confirmationMessageModal = createWindow({
            width: 500,
            height: 250,
            parent: registerProductsWindow,
            modal: true,
            resizable: false,
            minimizable: false,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProductsWindow/registerProductsWindow/confirmationMessageModal/confirmationMessageModal'
        loadUrl(confirmationMessageModal, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestRenderPage',
            (e) => e.reply('sendRenderPage'),
            registerProductsWindow
        )
        createNewIpcMain('modalResponse',
            (e, response) => {

                if (response) {
                    const port = store.get('port')
                    const dataBaseAddress = store.get('dataBaseAddress')

                    const axios = require('axios')

                    axios.delete(`http://${dataBaseAddress}:${port}/products/delete${productID}`)

                    registerProductsWindow.webContents.send('productInUsed', true)

                    confirmationMessageModal.close()
                } else {
                    confirmationMessageModal.close()
                }
            },
            confirmationMessageModal
        )
        createNewIpcMain('closeConfirmationMessageModal',
            () => confirmationMessageModal.close(),
            confirmationMessageModal
        )

        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    registerShortcut(confirmationMessageModal, 'alt+d', () => {
        confirmationMessageModal.webContents.send('requestModalResponse', true)
    })

    registerShortcut(confirmationMessageModal, 'alt+c', () => {
        confirmationMessageModal.webContents.send('requestModalResponse', false)
    })

    confirmationMessageModal.on('closed', () => {
        listenersCreated = false
        confirmationMessageModal = null
    })
    confirmationMessageModal.on('close', () => {
        registerProductsWindow.focus()
    })
}
export { startConfirmationMessageModal }