function startFinalizedQuotationsRotes(app, serverConsole, serverWindow) {
    const { readDataAtTable, addItem, removeItem } = require('../../../database/crud')
    app.get('/finalizedQuotations', async(req, res) => {
        const finalizedQuotation = await readDataAtTable('finalizedQuotations')
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Requisitou a lista de cotações finalizadas`)
        res.json(finalizedQuotation)
    })

    app.post('/finalizedQuotations/add', async(req, res) => {
        const idOfQuotationToBeDeleted = req.body.quotationID
        const name = req.body.quotationName
        const quotation = JSON.stringify(req.body.finalizedQuotation)
        serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Finalizou uma cotação`)
        await addItem({
            name: name,
            quotation: quotation
        }, 'finalizedQuotations')
        await removeItem(idOfQuotationToBeDeleted, 'openedQuotations')
    })
}
export { startFinalizedQuotationsRotes }