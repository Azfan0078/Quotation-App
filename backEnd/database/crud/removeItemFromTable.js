module.exports = removeItemAtTable

async function removeItemAtTable(table, IDOfItemToBeRemoved) {
    const itemToBeRemoved = await table.findByPk(IDOfItemToBeRemoved)

    if (itemToBeRemoved === null) {
        console.log('Item not found!');
    } else {
        itemToBeRemoved.destroy({
            where: {},
            truncate: true
        }).then(() => {
            console.log(`The ID ${IDOfItemToBeRemoved} removed successful`)
        }).catch((err) => {
            console.log(`Delete error: ${err}`)
        })
    }
    return 'Item removido com sucesso'
}