async function processData(finalResultWindow, store) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    const urlOfProducts = `http://${dataBaseAddress}:${port}/products`
    const urlOfProviders = `http://${dataBaseAddress}:${port}/providers`

    const axios = require('axios')

    const allProviders = await axios.get(urlOfProviders)

    const allProducts = await axios.get(urlOfProducts)

    const lastFinalizedQuotation = store.get('lastFinalizedQuotation')

    let arrayWithPricesProvidersAndProducts = lastFinalizedQuotation.finalResult
    let selectedProductsIDsAndPrices = []

    function prepareData() {
        function removePipe() {
            arrayWithPricesProvidersAndProducts.forEach(priceProviderAndProduct => {
                //These array is have prices in the index "0", providersIDs in the index "1" and productsIDs in the index "2"
                priceProviderAndProduct[2] = Number(priceProviderAndProduct[2].replace("|", ""))
                const productID = priceProviderAndProduct[2]
                selectedProductsIDsAndPrices[productID] = [productID]
            })
        }

        function putPriceInTheSelectProductsIDsAndPricesArray() {
            arrayWithPricesProvidersAndProducts.forEach(priceProviderAndProduct => {
                //These array is have prices in the index "0", providersIDs in the index "1" and productsIDs in the index "2"
                const productID = priceProviderAndProduct[2]
                const price = priceProviderAndProduct[0]
                selectedProductsIDsAndPrices[productID].push(price)
            })
        }
        removePipe()
        putPriceInTheSelectProductsIDsAndPricesArray()
    }
    prepareData()

    const result = {
        allProducts: allProducts.data,
        allProviders: allProviders.data,
        arrayWithPricesProvidersAndProducts,
        selectedProductsIDsAndPrices
    }

    finalResultWindow.webContents.send('sendDataOfFinalResultWindow', result)
}
export { processData }