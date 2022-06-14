const developerFunctions = {
    insertData(numberOfDataToInsert, selectedTable) {
        const { addItem } = require('../../database/crud')
        for (let i = 0; i < numberOfDataToInsert; i++) {
            const barCode = Math.floor(Math.random() * (1000000 - 10000) + 10000)
            if (selectedTable === 'products') {
                addItem({ description: `productInsertedByDeveloper ${i}`, barCode }, 'products')
            } else {
                addItem({ name: `providerInsertedByDeveloper ${i}` }, 'providers')
            }

        }
    },
    resetTables(store) {
        const { Sequelize, DataTypes } = require('sequelize')
        const configs = store.get('configs')
        const sequelize = new Sequelize(configs.nameOfDataBase, 'root', configs.passwordOfDataBase, {
            host: 'localhost',
            dialect: 'mysql'
        })
        const { createTables } = require('../../database/template/createTablesFunction')
        createTables(sequelize, DataTypes, true)
    }
}
export default developerFunctions