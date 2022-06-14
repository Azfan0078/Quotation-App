async function processData(selectProvidersWindow, store, ) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    const axios = require('axios')

    const url = `http://${dataBaseAddress}:${port}/providers`

    const allProviders = await axios.get(url)

    selectProvidersWindow.webContents.send('sendAllProviders', allProviders.data)

}
export { processData }