module.exports = readDataAtTable

async function readDataAtTable(table, frontTable) {
    const item = await table.findAll()
    const data = []

    switch (frontTable) {
        case 'products':
            for (let product of item) {
                data.push({
                    id: product.id,
                    barCode: product.barCode,
                    description: product.description,
                    lastBuyPrice: product.lastBuyPrice
                })
            }
            break;
        case 'providers':
            for (let provider of item) {
                data.push({
                    id: provider.id,
                    name: provider.name,
                })
            }
            break
        case 'openedQuotations':
            for (let quotation of item) {
                data.push({
                    id: quotation.id,
                    name: quotation.name,
                    selectedProducts: quotation.selectedProducts,
                    selectedProviders: quotation.selectedProviders
                })
            }
            break
        case 'finalizedQuotations':
            for (let quotation of item) {
                data.push({
                    id: quotation.id,
                    name: quotation.name,
                    quotation: quotation.quotation
                })
            }
    }

    return data
}