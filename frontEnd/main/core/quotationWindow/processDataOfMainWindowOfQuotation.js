async function processData(mainWindowOfQuotation, store) {
    const port = store.get('port')
    const dataBaseAddress = store.get('dataBaseAddress')

    let selectedQuotation = store.get('selectedQuotation')

    const axios = require('axios')
    const openedQuotations = await axios.get(`http://${dataBaseAddress}:${port}/openedQuotations`)

    function verifySelectedQuotation() {
        let verified = false
        if (selectedQuotation) {
            openedQuotations.data.forEach(quotation => {
                if (selectedQuotation.id === quotation.id) {
                    verified = true
                }
            })
        }

        return verified
    }

    if (!verifySelectedQuotation()) {
        selectedQuotation = ''
        store.delete('selectedQuotation')
        mainWindowOfQuotation.webContents.send('sendSelectedQuotation', '')
    }

    async function dataTreatment() {
        const urlOfProducts = `http://${dataBaseAddress}:${port}/products`
        const urlOfProviders = `http://${dataBaseAddress}:${port}/providers`

        const providers = await axios.get(urlOfProviders)
        const products = await axios.get(urlOfProducts)

        let selectedProductsIDs
        let selectedProvidersIDs
        let quotationName
        let quotationID

        if (selectedQuotation) {
            quotationName = selectedQuotation.name
            quotationID = selectedQuotation.id
            selectedProductsIDs = JSON.parse(selectedQuotation.selectedProducts).split(',')
            selectedProvidersIDs = JSON.parse(selectedQuotation.selectedProviders).split(',')
        }

        const get = {
            selectedProductsItem() {
                if (selectedQuotation && selectedProductsIDs) {
                    //These loops match the IDs of all selectedProducts with all products in the database.
                    return selectedProductsIDs.map(idOfSelectedProduct => {
                        for (let product of products.data) {
                            if (Number(idOfSelectedProduct) === product.id) {
                                return product
                            }
                        }
                    })
                }
            },
            selectedProvidersItem() {
                if (selectedProvidersIDs) {
                    //These loops match the IDs of all selectedProviders with all providers in the database.
                    return selectedProvidersIDs.map((idOfSelectedProvider) => {
                        for (let provider of providers.data) {
                            if (Number(idOfSelectedProvider) === provider.id) {
                                return provider
                            }
                        }
                    })
                }
            }
        }
        selectedQuotation = {
            selectedProducts: get.selectedProductsItem(),
            selectedProviders: get.selectedProvidersItem(),
            quotationName,
            quotationID
        }
        mainWindowOfQuotation.webContents.send('sendSelectedQuotation', selectedQuotation)
    }
    dataTreatment()

}
export { processData }