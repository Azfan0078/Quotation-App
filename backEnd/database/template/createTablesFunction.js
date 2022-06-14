import createFinalizedQuotationsTable from "./finalizedQuotations"
import createOpenedQuotationsTable from "./openedQuotations"
import createProvidersTable from "./providersTable"
import createProductsTable from "./productsTable"

function createTables(sequelize, DataTypes, force = false) {

    const finalizedQuotationTable = createFinalizedQuotationsTable(sequelize, DataTypes)
    const openedQuotations = createOpenedQuotationsTable(sequelize, DataTypes)
    const providersTable = createProvidersTable(sequelize, DataTypes)
    const productsTable = createProductsTable(sequelize, DataTypes)

    finalizedQuotationTable.sync({ force: force })
    openedQuotations.sync({ force: force })
    providersTable.sync({ force: force })
    productsTable.sync({ force: force })

}
export { createTables }