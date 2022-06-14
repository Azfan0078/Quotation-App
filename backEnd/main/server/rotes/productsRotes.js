function startProductsRotes(app, serverConsole, serverWindow) {
    const { readDataAtTable, addItem, removeItem, updateItemFromTable } = require('../../../database/crud')
    app.get('/products', async(req, res) => {
        const products = await readDataAtTable('products')
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Requisitou a lista de produtos`)
        res.json(products)
    })
    app.post('/products/add', async(req, res) => {
        const description = req.body.description
        const barCode = req.body.barCode
        const lastBuyPrice = req.body.lastBuyPrice
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Cadastrou um produto`)
        addItem({ description, barCode, lastBuyPrice }, 'products')

    })
    app.post('/products/edit', async(req, res) => {
        const idOfProductToBeEdited = req.body.id
        const options = { description: req.body.description, barCode: req.body.barCode }
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Editou um Produto`)
        await updateItemFromTable(idOfProductToBeEdited, 'products', options)
    })
    app.delete('/products/delete:id', async(req, res) => {
        const idOfProductToBeDeleted = Number(req.params.id)
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Deletou um produto`)

        await removeItem(idOfProductToBeDeleted, 'products')
    })
}
export { startProductsRotes }