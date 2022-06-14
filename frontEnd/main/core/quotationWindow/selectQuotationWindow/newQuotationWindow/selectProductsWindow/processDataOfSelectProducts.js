async function processData(selectProductsWindow, store) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    const axios = require('axios')
    const url = `http://${dataBaseAddress}:${port}/products`

    const allProducts = await axios.get(url)

    selectProductsWindow.webContents.send('sendAllProducts', allProducts.data, )

}
export { processData }