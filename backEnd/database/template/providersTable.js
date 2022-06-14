module.exports = createProvidersTable

function createProvidersTable(sequelize, DataTypes) {
    const providersTable = sequelize.define('providers', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(65),
            unique: true,
            allowNull: false
        },

    })

    return providersTable

}