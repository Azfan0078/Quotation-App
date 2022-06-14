import { ipcMain } from 'electron'

function createNewIpcMain(channel, callbackFunction, browserWindow = false) {
    let started = false
    if (!started) {
        ipcMain.on(`${channel}`, (e, data) => {
            callbackFunction(e, data)
        })
        if (browserWindow) {
            browserWindow.on('closed', () => {
                ipcMain.removeAllListeners(`${channel}`)
            })
        }
        started = true
    }

}
export default createNewIpcMain