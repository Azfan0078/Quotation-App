import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import ReactDOM from 'react-dom'

import styles from './confirmationMessageModal.module.css'

import Button from '../../../../components/button/button'
function confirmationMessageModal() {

    if (ipcRenderer) {
        ipcRenderer.send('requestQuotationIDAndQuotationNameAndFinalResult')
        ipcRenderer.on('requestModalResponse', (e, response) => {
            if (response) {
                const form = document.getElementById('form')
                form.submit()
            }
            ipcRenderer.send('modalResponse', response)
        })
        ipcRenderer.on('sendQuotationIDAndQuotationNameAndFinalResult', (e, data) => {
            function renderPage() {
                const quotationID = data.quotationID
                const quotationName = data.quotationName
                const finalResult = data.finalResult

                const dataBaseAddressAndPort = ipcRenderer.sendSync('reqDataBaseAddressAndPort')
                const dataBaseAddress = dataBaseAddressAndPort.dataBaseAddress
                const port = dataBaseAddressAndPort.port

                const confirmationMessageModal = (
                    <div className={styles.confirmationMessageModal}>

                        <title>Confirmação</title>
                        <div className='w-full'>
                            <h1 className={styles.textHeader}>Você tem certeza que <br />deseja finalizar esta cotação ?</h1>
                            <p style={{ marginLeft: '65px' }}>Ao finalizar esta cotação, você não poderá mais alterar os preços nela digitados.</p>
                        </div>
                        <div className={styles.divButtons}>
                            <form action={`http://${dataBaseAddress}:${port}/finalizedQuotations/add`} id='form' method='POST'>
                                <input type="hidden" name='finalizedQuotation' value={finalResult} />
                                <input type="hidden" name="quotationName" value={quotationName} />
                                <input type="hidden" name="quotationID" value={quotationID} />
                                <button type='submit'
                                    className={`${styles.button} mR-5px`}
                                    onClick={(e) => {
                                        ipcRenderer.send('modalResponse', true)
                                    }}>

                                    F<u>i</u>nalizar Cotação
                                </button>
                            </form>
                            <Button
                                onClick={() => { ipcRenderer.send('modalResponse', false) }}>
                                <u>C</u>ancelar
                            </Button>
                        </div>
                    </div>
                )
                ReactDOM.render(confirmationMessageModal, document.getElementById('confirmationMessageModal'))
            }
            renderPage()

        })
        function shortCuts() {
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Escape') {
                    ipcRenderer.send('closeConfirmationMessageModal')
                }
            })
        }
        shortCuts()

    }

    return (
        <div style={{ height: '100%', width: '100%' }} id='confirmationMessageModal'>

        </div>
    )
}
export default confirmationMessageModal