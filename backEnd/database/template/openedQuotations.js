module.exports = createOpenedQuotationsTable

function createOpenedQuotationsTable(sequelize, DataTypes) {
    const openedQuotations = sequelize.define('openedQuotations', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        selectedProducts: {
            type: DataTypes.JSON,
            unique: false,
            allowNull: false
        },
        selectedProviders: {
            type: DataTypes.JSON,
            unique: false,
            allowNull: false
        }
    })

    return openedQuotations

}