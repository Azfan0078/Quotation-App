const Store = require('electron-store')
const store = new Store()

const configs = store.get('configs')

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(configs.nameOfDataBase, 'root', configs.passwordOfDataBase, {
    host: 'localhost',
    dialect: 'mysql'
})

const table = {
    productsTable: () => {
        const createProductsTable = require('../template/productsTable')
        return createProductsTable(sequelize, DataTypes)
    },
    providersTable: () => {
        const createProvidersTable = require('../template/providersTable')
        return createProvidersTable(sequelize, DataTypes)
    },
    openedQuotationsTable: () => {
        const createOpenedQuotationsTable = require('../template/openedQuotations')
        return createOpenedQuotationsTable(sequelize, DataTypes)
    },
    finalizedQuotationsTable: () => {
        const createFinalizedQuotationsTable = require('../template/finalizedQuotations')
        return createFinalizedQuotationsTable(sequelize, DataTypes)
    }
}

async function addItem(options, frontTable) {
    const addItemsToTable = require('./addItemsToTable')
    let tableToBeRead

    switch (frontTable) {
        case 'products':
            tableToBeRead = table.productsTable()
            break;
        case 'providers':
            tableToBeRead = table.providersTable()
            break
        case 'openedQuotations':
            tableToBeRead = table.openedQuotationsTable()
            break
        case 'finalizedQuotations':
            tableToBeRead = table.finalizedQuotationsTable()
            break
    }

    return await addItemsToTable(tableToBeRead, options)
}
async function readDataAtTable(frontTable) {
    const readDataAtTable = require('./readDataAtTable')
    let tableToBeRead

    switch (frontTable) {
        case 'products':
            tableToBeRead = table.productsTable()
            break;
        case 'providers':
            tableToBeRead = table.providersTable()
            break
        case 'openedQuotations':
            tableToBeRead = table.openedQuotationsTable()
            break
        case 'finalizedQuotations':
            tableToBeRead = table.finalizedQuotationsTable()
            break
    }
    const result = await readDataAtTable(tableToBeRead, frontTable)
    return result
}
async function removeItem(idOfItemToBeDeleted, frontTable) {
    const removeItemAtTable = require('./removeItemFromTable')
    let tableToBeRead

    switch (frontTable) {
        case 'products':
            tableToBeRead = table.productsTable()
            break;
        case 'providers':
            tableToBeRead = table.providersTable()
            break
        case 'openedQuotations':
            tableToBeRead = table.openedQuotationsTable()
            break
        case 'finalizedQuotations':
            tableToBeRead = table.finalizedQuotationsTable()
            break
    }


    return await removeItemAtTable(tableToBeRead, idOfItemToBeDeleted)
}
async function updateItemFromTable(IDOfItemToBeEdited, frontTable, options) {
    const updateItemFromTable = require('./updateItemAtTable')
    let tableToBeRead

    switch (frontTable) {
        case 'products':
            tableToBeRead = table.productsTable()
            break;
        case 'providers':
            tableToBeRead = table.providersTable()
            break

    }
    updateItemFromTable(IDOfItemToBeEdited, tableToBeRead, frontTable, options)
}

module.exports = { addItem, readDataAtTable, removeItem, updateItemFromTable }