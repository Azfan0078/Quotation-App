module.exports = createFinalizedQuotationsTable

function createFinalizedQuotationsTable(sequelize, DataTypes) {
    const finalizedQuotations = sequelize.define('finalizedQuotations', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        quotation: {
            type: DataTypes.JSON,
            unique: false,
            allowNull: false
        }
    })

    return finalizedQuotations

}