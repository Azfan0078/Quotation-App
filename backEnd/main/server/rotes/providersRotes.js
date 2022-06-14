function startProvidersRotes(app, serverConsole, serverWindow) {
    const { readDataAtTable, addItem, removeItem, updateItemFromTable } = require('../../../database/crud')
    app.get('/providers', async(req, res) => {
        const providers = await readDataAtTable('providers')
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Requisitou a lista de fornecedores`)
        res.json(providers)
    })

    app.post('/providers/add', async(req, res) => {
        const name = req.body.name
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Cadastrou um fornecedor`)
        addItem({ name: name }, 'providers')
    })
    app.post('/providers/edit', async(req, res) => {
        const idOfProductToBeEdited = Number(req.body.id)
        const options = { name: req.body.name }
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Editou um fornecedor`)
        await updateItemFromTable(idOfProductToBeEdited, 'providers', options)
    })
    app.delete('/providers/delete:id', async(req, res) => {
        const idOfProviderToBeDeleted = Number(req.params.id)
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Deletou um produto`)
        await removeItem(idOfProviderToBeDeleted, 'providers')
    })
}
export { startProvidersRotes }