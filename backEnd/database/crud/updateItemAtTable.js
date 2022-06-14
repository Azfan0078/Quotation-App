module.exports = updateItemFromTable

async function updateItemFromTable(item, table, frontTable, options) {
    const itemFromTable = await table.findByPk(item)


    switch (frontTable) {
        case 'products':
            {
                if (!options.barCode) {
                    options.barCode = itemFromTable.barCode
                }
                if (!options.lastBuyPrice) {
                    options.lastBuyPrice = itemFromTable.lastBuyPrice
                }
            }
            break;
        case 'providers':
            {
                if (!options.name) {
                    options.name = itemFromTable.name
                }

            }

    }


    itemFromTable.update(options).then(() => {
        console.log(itemFromTable)
    }).catch((err) => {
        console.log(`Erro ao atualizar os dados` + err)
    })
}