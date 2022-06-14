let confirmationMessageModal
let listenersCreated = false

function startConfirmationMessageModal(providerID, registerProvidersWindow, store) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../../../../../../helpers');

    if (!confirmationMessageModal) {
        confirmationMessageModal = createWindow({
            width: 500,
            height: 250,
            parent: registerProvidersWindow,
            modal: true,
            resizable: false,
            minimizable: false,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProvidersWindow/registerProvidersWindow/confirmationMessageModal/confirmationMessageModal'
        loadUrl(confirmationMessageModal, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestRenderPage',
            (e) => e.reply('sendRenderPage'),
            confirmationMessageModal
        )
        createNewIpcMain('modalResponse',
            (e, response) => {
                if (response) {
                    const port = store.get('port')
                    const dataBaseAddress = store.get('dataBaseAddress')

                    const axios = require('axios')
                    axios.delete(`http://${dataBaseAddress}:${port}/providers/delete${providerID}`)

                    registerProvidersWindow.webContents.send('providerInUsed', true)

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
        registerProvidersWindow.focus()
    })
}
export { startConfirmationMessageModal }