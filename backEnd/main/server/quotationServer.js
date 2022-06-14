import { ipcMain } from 'electron'
import { Sequelize, DataTypes } from 'sequelize'

import express from 'express'
const app = express()

let server
let sequelize

async function startQuotationServer(serverWindow, store) {
    const { serverConsole, createNewIpcMain } = require('../helpers')

    const configs = store.get('configs')

    express.urlencoded({ extended: false })
    app.use(express.urlencoded({ extended: false }))

    if (configs.nameOfDataBase && configs.port && configs.passwordOfDataBase) {
        sequelize = new Sequelize(configs.nameOfDataBase, 'root', configs.passwordOfDataBase, {
            host: 'localhost',
            dialect: 'mysql'
        })

        const { createTables } = require('../../database/template/createTablesFunction')
        createTables(sequelize, DataTypes)

        if (!server) {
            server = app.listen(configs.port, (err) => {
                sequelize.authenticate().then(async() => {
                    createNewIpcMain('authenticateServer', () => {
                        serverConsole.sendMessage(serverWindow, `- Servidor rodando na porta "${configs.port}"`)
                        serverConsole.sendMessage(serverWindow, `- Banco de dados "${configs.nameOfDataBase}" inicializado`)
                    })

                    const { startRotes } = require('./rotes')
                    startRotes(app, serverWindow)

                    serverConsole.sendMessage(serverWindow, `- Servidor rodando na porta "${configs.port}"`)
                    serverConsole.sendMessage(serverWindow, `- Banco de dados "${configs.nameOfDataBase}" inicializado`)
                }).catch(err => {
                    createNewIpcMain('authenticateServer', () => {
                        serverConsole.sendMessage(serverWindow, `- Servidor rodando na porta "${configs.port}"`)
                        serverConsole.sendMessage(serverWindow, "- Erro ao inicializar o banco de dados, verifique os dados")
                    })
                    serverConsole.sendMessage(serverWindow, `- Servidor rodando na porta "${configs.port}"`)
                    serverConsole.sendMessage(serverWindow, "- Erro ao inicializar o banco de dados, verifique os dados")
                })
            })
        }
    }
}

function closeQuotationServer(serverWindow) {
    ipcMain.removeAllListeners('authenticateServer')
    sequelize.close().then(() => serverConsole.sendMessage(serverWindow, '- Banco de dados finalizado'))
    if (server) {
        try {
            server.close()
            serverConsole.sendMessage(serverWindow, '- Servidor finalizado')
        } catch (err) {
            console.log(err)
        }
    }
    server = null
    sequelize = null
}
export { startQuotationServer, closeQuotationServer }