import electron from 'electron'
import ReactDOM from 'react-dom'
const ipcRenderer = electron.ipcRenderer || false
import styles from './serverWindow.module.css'

function serverWindow() {
    let configs = {}
    let messages = []

    if (ipcRenderer) {
        configs = ipcRenderer.sendSync('requestConfigs')

        ipcRenderer.send('authenticateServer')
    }
    function resultOfServer() {
        if (ipcRenderer) {
            ipcRenderer.on('sendMessage', (e, message) => {

                messages.push(<p className={styles.message}>{message}</p>)

                ReactDOM.unmountComponentAtNode(document.getElementById('console'))
                ReactDOM.render(messages, document.getElementById('console'))

            })
        }
        return <div>{messages}</div>

    }
    function devFunctions() {
        const isProd = process.env.NODE_ENV === 'production';

        if (!isProd) {
            return <button onClick={() => {
                ipcRenderer.send('openDeveloperFunctions')
            }} style={{ marginLeft: '10px' }}>Funções de desenvolvedor</button>
        }
    }
    return (
        <div className={styles.serverWindow}>
            <title>Quotation Server</title>
            <div className={styles.internalDiv}>
                <div className={styles.externalDivOfConsole}>
                    <div className={styles.console} >
                        <div className={styles.buttons}>
                            <div className={styles.gear}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16"

                                    onClick={(e) => {
                                        ipcRenderer.send('openConfigDataBaseWindow')
                                    }}>
                                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                </svg>
                            </div>
                            <div >
                                <button className={styles.clearButton} onClick={() => {
                                    messages = []
                                    ReactDOM.unmountComponentAtNode(document.getElementById('console'))
                                    ReactDOM.render(messages, document.getElementById('console'))

                                }}>Limpar console</button>
                            </div>
                            
                            <div>
                                {devFunctions()}
                            </div>
                        </div>


                        <div className={styles.divMessages} id='console'>
                            {resultOfServer()}
                        </div>
                    </div>
                </div>

            </div>

        </div >
    )

}
export default serverWindow
