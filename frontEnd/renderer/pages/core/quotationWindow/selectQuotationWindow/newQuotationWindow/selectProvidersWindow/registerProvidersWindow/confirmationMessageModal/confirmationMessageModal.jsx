import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false
import ReactDOM from 'react-dom'
import styles from './confirmationMessageModal.module.css'

import Button from '../../../../../../../../components/button/button'
function confirmationMessageModal() {

    if (ipcRenderer) {
        ipcRenderer.on('requestModalResponse', (e, response) => {
            ipcRenderer.send('modalResponse', response)
        })
        ipcRenderer.send('requestRenderPage')
        ipcRenderer.on('sendRenderPage', (e) => {

            function renderPage() {

                const confirmationMessageModal = (
                    <div className={styles.confirmationMessageModal}>

                        <title>Confirmação</title>
                        <div className='w-full'>
                            <h1 className={styles.textHeader}>Você tem certeza que <br />deseja deletar este item ?</h1>
                            <p style={{ marginLeft: '65px' }}>Ao deletar este item cotação, você não poderá mais recupera-lo.</p>
                        </div>
                        <div className={styles.divButtons}>


                            <button type='submit'
                                className={`${styles.button} mR-5px`}
                                onClick={(e) => {
                                    ipcRenderer.send('modalResponse', true)
                                }}>

                                <u>D</u>eletar Item
                            </button>

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