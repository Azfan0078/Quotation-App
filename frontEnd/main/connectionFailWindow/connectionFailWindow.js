let connectionFailWindow

function startConnectionFailWindow(store) {
    const { createWindow, loadUrl, createNewIpcMain } = require('../helpers');
    if (!connectionFailWindow) {
        connectionFailWindow = createWindow({
            width: 400,
            height: 350,

        })
        const urlOfPage = '/connectionFailWindow/connectionFailWindow'
        loadUrl(connectionFailWindow, urlOfPage)
    }
    createNewIpcMain('setDataBaseAddressAndPort', async(e, dataBaseAddressAndPort) => {

        if (dataBaseAddressAndPort.dataBaseAddress && dataBaseAddressAndPort.port) {
            const dataBaseAddress = dataBaseAddressAndPort.dataBaseAddress
            const port = dataBaseAddressAndPort.port

            store.set('dataBaseAddress', dataBaseAddress)
            store.set('port', port)

            try {
                const axios = require('axios');
                await axios.get(`http://${dataBaseAddress}:${port}/verifyConnection`)

                const { startMainWindowOfQuotation } = require('../core/quotationWindow/quotationWindow')

                startMainWindowOfQuotation(store)
                connectionFailWindow.close()

            } catch (err) {
                console.log(err)
                startConnectionFailWindow(store)
            }
        }

    }, connectionFailWindow)

    connectionFailWindow.on('closed', () => {
        connectionFailWindow = null
    })
}
export { startConnectionFailWindow }