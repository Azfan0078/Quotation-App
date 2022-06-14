import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import { useState } from 'react'

import styles from './configDataBaseWindow.module.css'
import Input from '../../../components/input/input.tsx'

function configDataBaseWindow() {
    let configs = {}
    if (ipcRenderer) {
        configs = ipcRenderer.sendSync('requestConfigs') || {}
    }
    const [nameOfDataBase, setNameOfDataBase] = useState(configs.nameOfDataBase)
    const [passwordOfDataBase, setPasswordOfDataBase] = useState(configs.passwordOfDataBase)
    const [port, setPort] = useState(configs.port)

    return (
        <div className={styles.configDataBaseWindowForm}>
            <title>Config Server</title>
            <div className={styles.divForm}>
                
                <Input type='text' label='Nome do banco de dados' value={nameOfDataBase} onChange={(e) => {
                    setNameOfDataBase(e.target.value)
                }} />
                
                <Input type='password' label='Senha do banco de dados' value={passwordOfDataBase} onChange={(e) => {
                    setPasswordOfDataBase(e.target.value)
                }}/>
                <Input type='text' label='Porta do servidor' value={port} onChange={(e) => {
                    setPort(e.target.value)
                }} />
                
                <button type='submit' className={styles.button} onClick={(e) => {
                    ipcRenderer.send('configDataBase', { nameOfDataBase, passwordOfDataBase, port })
                }}>Configurar</button>
            </div>

        </div>
    )
}
export default configDataBaseWindow