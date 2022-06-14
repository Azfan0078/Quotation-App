module.exports = createProductsTable

function createProductsTable(sequelize, DataTypes) {
    const productsTable = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        barCode: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(65),
            unique: true,
            allowNull: false
        },
        lastBuyPrice: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    })

    return productsTable

}