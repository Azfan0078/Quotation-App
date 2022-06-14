function startRotes(app, serverWindow) {
    const { serverConsole } = require('../../helpers')

    function cors() {
        const isProd = process.env.NODE_ENV === 'production';
        let corsInDev = ''
        if (!isProd) corsInDev = `http://localhost:8888`

        const cors = require("cors");
        const corsOptions = {
            origin: [corsInDev, 'app://.'],
            credentials: true,
            optionSuccessStatus: 200,
        }
        app.use(cors(corsOptions))
    }
    cors()

    function startAllRotes() {
        app.get('/verifyConnection', (req, res) => {
            serverConsole.sendMessage(serverWindow, `- "${req.hostname}" Conectou-se ao servidor`)
            res.json({})
        })
        const { startProductsRotes } = require('./productsRotes')
        startProductsRotes(app, serverConsole, serverWindow)

        const { startProvidersRotes } = require('./providersRotes')
        startProvidersRotes(app, serverConsole, serverWindow)

        const { startOpenedQuotationsRotes } = require('./openedQuotationsRotes')
        startOpenedQuotationsRotes(app, serverConsole, serverWindow)

        const { startFinalizedQuotationsRotes } = require('./finalizedQuotationsRotes')
        startFinalizedQuotationsRotes(app, serverConsole, serverWindow)
    }
    startAllRotes()
}
export { startRotes }