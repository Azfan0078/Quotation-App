import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from 'react'
import ReactDOM from 'react-dom'

import styles from './registerProductsWindow.module.css'

import Message from '../../../../../../../components/message/message'
function registerProductsWindow() {

    let description = ''
    let barCode = ''
    if (ipcRenderer) {
        ipcRenderer.send('requestSelectedProduct')
        ipcRenderer.on('sendProduct', (e, selectedProductID = null) => {

            const dataBaseAddressAndPort = ipcRenderer.sendSync('reqDataBaseAddressAndPort')
            const dataBaseAddress = dataBaseAddressAndPort.dataBaseAddress
            const port = dataBaseAddressAndPort.port

            let messagesToShow = []

            let productID
            let addOrEdit = 'add'
            let labelButton = 'Salvar'
            let deleteButtonDisabled = true

            const message = {
                render(message) {
                    let successLabel = 'Item salvo com sucesso'
                    if (addOrEdit === 'edit') {
                        successLabel = 'Produto editado com sucesso'
                    }

                    const itemAlreadyRegisteredMessage = <Message
                        visible={true}
                        label="Item já foi salvo, verifique os dados!"
                        className='bgRed'
                    />
                    const successMessage = <Message
                        visible={true}
                        label={successLabel}
                        className='bgGreen'
                    />
                    const barCodeMessage = <Message
                        visible={true}
                        label='Código de barra inválido'
                        className='bgRed'
                    />
                    const descriptionMessage = <Message
                        visible={true}
                        label='Descrição inválida'
                        className='bgRed'
                    />
                    const productInUseMessage = <Message
                        visible={true}
                        label='Há uma ou mais cotações utilizando este produto'
                        className='bgRed'
                    />
                    const productDeleted = <Message
                        visible={true}
                        label='Produto deletado com sucesso'
                        className='bgGreen'
                    />
                    switch (message) {
                        case 'itemAlreadyRegistered': {
                            messagesToShow[0] = itemAlreadyRegisteredMessage
                        }
                            break
                        case 'successMessage': {
                            messagesToShow[1] = successMessage
                        }
                            break
                        case 'barCodeError': {
                            messagesToShow[2] = barCodeMessage
                        }
                            break
                        case 'descriptionError': {
                            messagesToShow[3] = descriptionMessage
                        }
                            break
                        case 'productInUse': {
                            messagesToShow[4] = productInUseMessage
                        }
                            break
                        case 'productDeleted': {
                            messagesToShow[5] = productDeleted
                        }
                    }
                    ReactDOM.unmountComponentAtNode(document.getElementById('divMessages'))
                    ReactDOM.render(messagesToShow, document.getElementById('divMessages'))

                },
                reset() {
                    messagesToShow = []
                    ReactDOM.unmountComponentAtNode(document.getElementById('divMessages'))
                }
            }
            if (selectedProductID) {
                addOrEdit = 'edit'
                labelButton = 'Editar'
                deleteButtonDisabled = false
                const products = ipcRenderer.sendSync('requestProducts')
                const form = document.getElementById('productForm')

                const inputDescriptionAndSelectProductButton = form.children[0]
                const inputDescriptionDiv = inputDescriptionAndSelectProductButton.children[1]
                const inputDescription = inputDescriptionDiv.children[0]

                const inputBarCodeDiv = form.children[1]
                const inputBarCode = inputBarCodeDiv.children[1]

                products.forEach(product => {
                    if (product.id === selectedProductID) {

                        description = product.description
                        barCode = product.barCode
                        productID = product.id

                        inputDescription.value = product.description
                        inputBarCode.value = product.barCode
                    }
                })
            }
            ipcRenderer.on('productInUsed', (e, deleted) => {
                if (deleted) {
                    description = ''
                    barCode = ''
                    productID = ''
                    addOrEdit = 'add'
                    labelButton = 'Salvar'
                    deleteButtonDisabled = true
                    document.getElementById('description').value = ''
                    document.getElementById('barCode').value = ''

                    message.render('productDeleted')
                    renderPage()
                }
                else {
                    message.render('productInUse')
                }


            })
            function renderPage() {

                function validateForm() {
                    let validation = true
                    function verifyDescription() {
                        if (!description ||
                            description === null ||
                            description === undefined) {
                            message.render('descriptionError')
                            validation = false
                        }
                    }
                    function verifyBarCode() {

                        if (!Number(barCode) ||
                            !Number.isInteger(Number(barCode)) ||
                            barCode.length > 20) {

                            message.render('barCodeError')
                            validation = false
                        }
                    }

                    verifyDescription()
                    verifyBarCode()

                    return validation

                }
                async function verifyProduct() {
                    let validation = true
                    if (!selectedProductID) {

                        const products = ipcRenderer.sendSync('requestProducts')

                        for (let product of products) {

                            if (product.description === description || product.barCode === barCode) {
                                message.render('itemAlreadyRegistered')
                                validation = false
                                break
                            }
                        }
                    }
                    return validation
                }
                const registerProducts = (
                    <div className={styles.registerProducts}>
                        <title>Cadastro de Produtos</title>
                        <div className='borderGray-1px w-95 h-95' id='divForm'>
                            <form action={`http://${dataBaseAddress}:${port}/products/${addOrEdit}`} className={styles.form} method='POST' id='productForm'>
                                <div className={styles.divInput}>
                                    <label htmlFor="description" className={styles.inputLabel}>Descrição do produto</label>
                                    <div className={styles.divInputDescription}>
                                        <input
                                            type='text'
                                            name='description'
                                            id='description'
                                            style={{ border: 'none', width: '100%', background: 'none' }}
                                            className={styles.input}
                                            onChange={e => {
                                                description = e.target.value
                                                message.reset()
                                            }}
                                            onClick={() => {
                                                message.reset()
                                            }}
                                        />
                                        <span className={styles.span}>
                                            <div className={styles.externalDivOfSelectButton}>
                                                <button type='button' className={styles.internalDivOfSelectButton}
                                                    onClick={() => ipcRenderer.send('openAllProductsWindow')}>

                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </span>
                                    </div>

                                </div>

                                <div className={styles.divInput}>
                                    <label htmlFor="barCode" className={styles.inputLabel}>Código de barra</label>
                                    <input
                                        type='number'
                                        name='barCode'
                                        id='barCode'

                                        className={styles.input}
                                        onChange={e => {
                                            barCode = e.target.value
                                            message.reset()
                                        }}
                                        onClick={() => {
                                            message.reset()
                                        }}
                                    />
                                </div>
                                <input type="hidden" value={productID} name='id' />
                                <div>
                                    <button type='submit'
                                        className={styles.saveButton}
                                        onClick={async (e) => {
                                            if (!validateForm() || ! await verifyProduct()) {
                                                e.preventDefault()
                                            } else {

                                                message.render('successMessage')
                                            }
                                        }}>{labelButton}</button>
                                    <button type='button'
                                        style={{ marginLeft: '5px' }} disabled={deleteButtonDisabled}
                                        onClick={(e) => ipcRenderer.send('deleteProduct', productID)}>Excluir</button>
                                </div>

                            </form>

                            <div className={styles.divMessages} id='divMessages'>
                            </div>

                        </div>
                    </div>
                )
                ReactDOM.render(registerProducts, document.getElementById('registerProducts'))
            }
            renderPage()

            function shortCuts() {
                window.addEventListener('keydown', (e) => {
                    if (e.code === 'Escape') {
                        ipcRenderer.send('closeRegisterProductsWindow')
                    }
                })
            }
            shortCuts()
        })
    }

    return (
        <div style={{ height: '100%', width: '100%' }} id='registerProducts'>

        </div>
    )

}
export default registerProductsWindow