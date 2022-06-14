let selectedProductsId
let selectedProvidersId
async function processData(newQuotationWindow, selectedProductsIDs, selectedProvidersIDs, store) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    const axios = require('axios');
    const urlOfProducts = `http://${dataBaseAddress}:${port}/products`
    const urlOfProviders = `http://${dataBaseAddress}:${port}/providers`

    const allProviders = await axios.get(urlOfProviders)
    const allProducts = await axios.get(urlOfProducts)

    if (selectedProductsIDs) {
        selectedProductsId = selectedProductsIDs

    }
    if (selectedProvidersIDs) {
        selectedProvidersId = selectedProvidersIDs
    }

    const get = {
        selectedProducts() {
            //These loops match the IDs of all selectedProducts with all products in the database.
            return selectedProductsId.map(id => {

                for (const product of allProducts.data) {
                    if (product.id === id) {
                        return product
                    }
                }
            })
        },
        selectedProviders() {
            //These loops match the IDs of all selectedProviders with all providers in the database.
            return selectedProvidersId.map(id => {

                for (const provider of allProviders.data) {
                    if (provider.id === id) {
                        return provider
                    }
                }
            })
        }
    }

    const selectedProductsAndSelectedProviders = {
        selectedProducts: get.selectedProducts(),
        selectedProviders: get.selectedProviders()
    }

    newQuotationWindow.webContents.send('sendAllProductsAndAllProviders', selectedProductsAndSelectedProviders)
}
export { processData }