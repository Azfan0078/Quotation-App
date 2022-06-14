let confirmationMessageModal
let listenersCreated = false

function startConfirmationMessageModal(finalizedQuotation, mainWindowOfQuotation, store) {
    const { createWindow, loadUrl, createNewIpcMain, registerShortcut } = require('../../../helpers');
    if (!confirmationMessageModal) {
        confirmationMessageModal = createWindow({
            width: 500,
            height: 250,
            parent: mainWindowOfQuotation,
            modal: true,
            resizable: false,
            minimizable: false,
        })
        const urlOfPage = '/core/quotationWindow/confirmationMessageModal/confirmationMessageModal'
        loadUrl(confirmationMessageModal, urlOfPage)
    }

    function createListeners() {
        const quotationID = finalizedQuotation.quotationID
        const quotationName = finalizedQuotation.quotationName
        const finalResult = finalizedQuotation.finalResult.filter(element => element)

        createNewIpcMain('requestQuotationIDAndQuotationNameAndFinalResult',
            (e) => {
                const obj = { quotationID, quotationName, finalResult }
                e.reply('sendQuotationIDAndQuotationNameAndFinalResult', obj)
            },
            confirmationMessageModal
        )
        createNewIpcMain('modalResponse',
            (e, response) => {
                if (response) {
                    store.set('lastFinalizedQuotation', { quotationID, quotationName, finalResult })
                    store.delete('selectedQuotation')

                    const { processData } = require('../processDataOfMainWindowOfQuotation')
                    processData(mainWindowOfQuotation, store)

                    setTimeout(() => confirmationMessageModal.close(), 2000)

                    const { startFinalResultWindow } = require('./finalResultWindow/finalResultWindow');
                    startFinalResultWindow(mainWindowOfQuotation, store)
                } else {

                    setTimeout(() => confirmationMessageModal.close(), 2000)

                    mainWindowOfQuotation.webContents.send('refreshFinalResult', finalResult)
                    mainWindowOfQuotation.focus()
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

    registerShortcut(confirmationMessageModal, 'alt+i', () => {
        confirmationMessageModal.webContents.send('requestModalResponse', true)
    })

    registerShortcut(confirmationMessageModal, 'alt+c', () => {
        confirmationMessageModal.webContents.send('requestModalResponse', false)
    })

    confirmationMessageModal.on('closed', () => {
        listenersCreated = false
        confirmationMessageModal = null
    })
}
export { startConfirmationMessageModal }