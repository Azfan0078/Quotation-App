import { globalShortcut } from 'electron'

function registerShortcut(browserWindow, shortcut, callBackFunction) {

    browserWindow.on('focus', () => {
        globalShortcut.register(shortcut, () => callBackFunction())
    })
    browserWindow.on('blur', () => {

        globalShortcut.unregister(shortcut)
    })
    browserWindow.on('closed', () => {
        globalShortcut.unregister(shortcut)
    })
}
export default registerShortcut