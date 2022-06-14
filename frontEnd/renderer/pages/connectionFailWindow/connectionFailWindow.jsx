import electron from 'electron'
import { useState } from 'react'
const ipcRenderer = electron.ipcRenderer || false

import ReactDOM from 'react-dom'

import styles from './connectionFailWindow.module.css'
function connectionFailWindow() {
    const [port, setPort] = useState()
    const [dataBaseAddress, setDataBaseAddress] = useState()
    if (ipcRenderer) {

        function renderPage() {
            const connectionFailWindow = (
                <div className={styles.connectionFailWindow}>
                    <title>Erro ao conectar com o banco de dados</title>

                    <h1 style={{ fontSize: '15px' }}>Erro ao conectar com o banco de dados</h1>
                    <p>Verifique se ele está aberto e configurado corretamente</p>
                    <p style={{textAlign:'center'}}>O aplicativo abrirá assim que a conexão for realizada com sucesso!</p>

                    <form style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="dataBaseAddress">Endereço do banco de dados</label>
                        <input type="text" name="dataBaseAddress" id="dataBaseAddress" placeholder='Ex:192.168.0.1'
                            value={dataBaseAddress}
                            onChange={(e) => setDataBaseAddress(e.target.value)} />

                        <label htmlFor="port">Porta do banco de dados</label>
                        <input type="number" name="port" id="port" placeholder='Ex:51235'
                            value={port}
                            onChange={(e) => setPort(e.target.value)} />

                        <button style={{ marginTop: '10px' }} onClick={() => {
                            ipcRenderer.send('setDataBaseAddressAndPort', { dataBaseAddress, port })
                            ipcRenderer.send('refreshDataBaseAddressAndPort')
                        }}>Configurar</button>
                    </form>
                </div>
            )
            ReactDOM.render(connectionFailWindow, document.getElementById('connectionFailWindow'))
        }
        renderPage()
    }
    return <div style={{}} id='connectionFailWindow'>

    </div>


}
export default connectionFailWindow