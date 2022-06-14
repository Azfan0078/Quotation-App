async function processData(selectedQuotationWindow, store) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    const axios = require('axios')

    const urlOfOpenedQuotations = `http://${dataBaseAddress}:${port}/openedQuotations`

    const allOpenedQuotations = await axios.get(urlOfOpenedQuotations)

    selectedQuotationWindow.webContents.send('sendAllOpenedQuotations', allOpenedQuotations.data)
}
export { processData }