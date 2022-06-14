let developerFunctionsWindow
let listenersCreated = false

function startDeveloperFunctionsWindow(store, serverWindow) {
    const { createWindow, loadUrl, developerFunctions, createNewIpcMain } = require("../../helpers")

    if (!developerFunctionsWindow) {
        developerFunctionsWindow = createWindow({
            width: 800,
            height: 600,
            parent: serverWindow,
        })
        const urlOfPage = '/core/developerFunctionsWindow/developerFunctionsWindow'
        loadUrl(developerFunctionsWindow, urlOfPage)
    }

    function createListeners() {
        createNewIpcMain('insertData', (e, data) => {
            const numberOfDataToInsert = data.numberOfDataToInsert
            const selectedTable = data.selectedTable
            developerFunctions.insertData(numberOfDataToInsert, selectedTable)

        }, developerFunctionsWindow)
        createNewIpcMain('resetTables', () => {
            developerFunctions.resetTables(store)
        }, developerFunctionsWindow)
        listenersCreated = true
    }

    if (!listenersCreated) createListeners()

    developerFunctionsWindow.on('closed', () => {
        listenersCreated = false
        developerFunctionsWindow = null
    })
    developerFunctionsWindow.on('close', () => {
        serverWindow.focus()
    })

}
export { startDeveloperFunctionsWindow }