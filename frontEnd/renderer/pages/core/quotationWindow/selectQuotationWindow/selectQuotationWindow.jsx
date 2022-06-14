const electron = require('electron')
const ipcRenderer = electron.ipcRenderer || false

import ReactDOM from 'react-dom'
import styles from './selectQuotationWindow.module.css'

import Button from '../../../../components/button/button'

function selectQuotationWindow() {
    let selectedQuotationID = 0

    if (ipcRenderer) {
        let openedQuotations
        function selectQuotation() {
            let selectedQuotation
            for (let quotation of openedQuotations) {
                if (quotation.id === selectedQuotationID) {
                    selectedQuotation = quotation
                }
            }
            ipcRenderer.send('sendSelectedQuotation', selectedQuotation)
        }
        ipcRenderer.send('requestAllOpenedQuotations')
        ipcRenderer.on('requestSendSelectedQuotation', () => {
            selectQuotation()
        })
        ipcRenderer.on('sendAllOpenedQuotations', (e, data) => {
            openedQuotations = data
            function renderOpenedQuotationsList() {

                const result = openedQuotations.map(quotation => {

                    return (
                        <option
                            key={quotation.id}
                            value={quotation.id}>
                            {quotation.name}
                        </option>
                    )
                })
                return result

            }
            function renderPage() {
                const selectQuotationWindow = (
                    <div className={styles.selectQuotationWindow}>
                        <title>Selecionar cotação</title>
                        <div className={styles.selectDiv}>
                            <select
                                size={15}
                                className={styles.select}
                                onChange={(e) => {
                                    const id = e.target.value
                                    selectedQuotationID = Number(id)
                                }}>
                                {renderOpenedQuotationsList()}
                            </select>
                        </div>
                        <div className={styles.buttonsDiv}>
                            <Button
                                onClick={selectQuotation}>
                                <u>C</u>onfirmar cotação
                            </Button>

                            <Button onClick={() => ipcRenderer.send('openNewQuotationWindow')}>
                                <u>N</u>ova Cotação
                            </Button>
                        </div>

                    </div>
                )
                ReactDOM.unmountComponentAtNode(document.getElementById('selectQuotationWindow'))
                ReactDOM.render(selectQuotationWindow, document.getElementById('selectQuotationWindow'))
            }
            renderPage()

        })
        function shortCuts() {
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Escape') {
                    ipcRenderer.send('closeSelectQuotationWindow')
                }
            })
        }
        shortCuts()
    }
    return <div style={{ height: '100%', width: "100%" }} id='selectQuotationWindow'></div>

}
export default selectQuotationWindow
