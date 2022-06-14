function startOpenedQuotationsRotes(app, serverConsole, serverWindow) {
    const { readDataAtTable, addItem, removeItem } = require('../../../database/crud')
    app.get('/openedQuotations', async(req, res) => {
        const openedQuotations = await readDataAtTable('openedQuotations')
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Requisitou a lista de cotações abertas`)
        res.json(openedQuotations)
    })

    app.post('/openedQuotations/add', async(req, res) => {
        const name = req.body.quotationName
        const selectedProducts = JSON.stringify(req.body.selectedProducts)
        const selectedProviders = JSON.stringify(req.body.selectedProviders)
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Abriu uma nova cotação`)
        await addItem({
            name,
            selectedProducts,
            selectedProviders
        }, 'openedQuotations')
    })
}
export { startOpenedQuotationsRotes }