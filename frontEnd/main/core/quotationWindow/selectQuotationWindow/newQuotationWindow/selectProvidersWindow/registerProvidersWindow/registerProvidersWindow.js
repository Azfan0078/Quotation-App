let registerProvidersWindow
let listenersCreated = false

async function startRegisterProvidersWindow(selectProvidersWindow, store) {

    const { createWindow, loadUrl, createNewIpcMain } = require('../../../../../../helpers')

    if (!registerProvidersWindow) {
        registerProvidersWindow = await createWindow({
            width: 800,
            height: 360,
            parent: selectProvidersWindow,
        })
        const urlOfPage = '/core/quotationWindow/selectQuotationWindow/newQuotationWindow/selectProvidersWindow/registerProvidersWindow/registerProvidersWindow'
        loadUrl(registerProvidersWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('requestProviders',
            async(e) => {
                const port = store.get('port')
                const dataBaseAddress = store.get('dataBaseAddress')

                const axios = require('axios')

                const url = `http://${dataBaseAddress}:${port}/providers`

                const providers = await axios.get(url)

                e.returnValue = providers.data
            },
            registerProvidersWindow
        )
        createNewIpcMain('closeRegisterProvidersWindow',
            () => registerProvidersWindow.close(),
            registerProvidersWindow
        )
        createNewIpcMain('requestSelectedProvider',
            (e) => e.reply('sendProvider'),
            registerProvidersWindow
        )
        createNewIpcMain('openAllProvidersWindow', () => {
                const { startAllProvidersWindow } = require('./allProvidersWindow/allProvidersWindow')
                startAllProvidersWindow(registerProvidersWindow, store)
            },
            registerProvidersWindow
        )
        createNewIpcMain('deleteProvider', async(e, providerID) => {
                async function validateItemToBeDeleted() {
                    const port = store.get('port')
                    const dataBaseAddress = store.get('dataBaseAddress')

                    const axios = require('axios')
                    const reqOpenedQuotations = await axios.get(`http://${dataBaseAddress}:${port}/openedQuotations`)

                    const openedQuotations = reqOpenedQuotations.data

                    let validate = true
                    openedQuotations.forEach(openedQuotation => {
                        const selectedProvidersIDs = openedQuotation.selectedProviders
                        const selectedProvidersIDsArray = JSON.parse(selectedProvidersIDs).split(',')

                        selectedProvidersIDsArray.forEach(selectedProviderID => {
                            if (selectedProviderID == providerID) {
                                validate = false
                            }
                        })
                    })
                    return validate
                }
                if (await validateItemToBeDeleted()) {
                    const { startConfirmationMessageModal } = require('./confirmationMessageModal/confirmationMessageModal')
                    startConfirmationMessageModal(providerID, registerProvidersWindow, store)

                } else {
                    registerProvidersWindow.webContents.send('providerInUsed', false)
                }
            },
            registerProvidersWindow
        )
        listenersCreated = true
    }
    if (!listenersCreated) createListeners()

    registerProvidersWindow.on('closed', () => {
        const { processData } = require('../processDataOfSelectProvidersWindow')
        processData(selectProvidersWindow, store)

        listenersCreated = false
        registerProvidersWindow = null
    })
    registerProvidersWindow.on('close', () => {
        selectProvidersWindow.focus()
    })
}
export { startRegisterProvidersWindow }