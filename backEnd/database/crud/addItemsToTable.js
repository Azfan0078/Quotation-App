module.exports = addItemToTable

async function addItemToTable(table, options) {
    let result

    await table.create(options).then(() => {
        result = true
    }).catch(err => {
        console.log('save item error ' + err)
        result = false
    })
    return result
}