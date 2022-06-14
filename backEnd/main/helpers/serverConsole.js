const serverConsole = {
    sendMessage(serverConsoleWindow, message) {

        serverConsoleWindow.webContents.send('sendMessage', `${message}`)
    }
}
export default serverConsole