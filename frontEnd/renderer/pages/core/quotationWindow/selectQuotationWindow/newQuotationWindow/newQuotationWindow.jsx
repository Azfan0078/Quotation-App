import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false;

import React from 'react'
import ReactDOM from 'react-dom'

import styles from './newQuotationWindow.module.css'

import Table from '../../../../../components/table/table'
import Message from '../../../../../components/message/message';

function newQuotationWindow() {
    let messagesToShow = []
    let selectedProductsItem
    let selectedProvidersItem
    let quotationName = ''

    if (ipcRenderer) {
        const dataBaseAddressAndPort = ipcRenderer.sendSync('reqDataBaseAddressAndPort')
        let dataBaseAddress = dataBaseAddressAndPort.dataBaseAddress
        let port = dataBaseAddressAndPort.port
        ipcRenderer.send('requestSelectedProductsAndSelectedProviders')

        ipcRenderer.on('sendAllProductsAndAllProviders', (e, selectedProductsAndSelectedProviders) => {

            function renderPage() {
                selectedProductsItem = selectedProductsAndSelectedProviders.selectedProducts
                selectedProvidersItem = selectedProductsAndSelectedProviders.selectedProviders

                let selectedProductsId = selectedProductsItem.map(product => product.id)
                let selectedProvidersId = selectedProvidersItem.map(provider => provider.id)

                const messages = {
                    render(message) {
                        const selectedProductsMessage = <Message
                            visible={true}
                            label='Produtos inválidos'
                            className='bgRed'
                        />
                        const selectedProvidersMessage = <Message
                            visible={true}
                            label='Fornecedores inválidos'
                            className='bgRed'
                        />
                        const quotationName = <Message
                            visible={true}
                            label='Nome da cotação invalido'
                            className='bgRed'
                        />
                        const itemAlreadyRegistered = <Message
                            visible={true}
                            label="Este nome de cotação ja está em uso, verifique os dados!"
                            className={`bgRed ${styles.itemAlreadyRegisteredMessage}`}
                        />
                        const successMessage = <Message
                            visible={true}
                            label='Cotação aberta'
                            className='bgGreen'
                        />

                        switch (message) {
                            case 'selectProductsMessage': {
                                messagesToShow[0] = selectedProductsMessage
                            }
                                break
                            case 'selectProvidersMessage': {
                                messagesToShow[1] = selectedProvidersMessage
                            }
                                break
                            case 'quotationNameMessage': {
                                messagesToShow[2] = quotationName
                            }
                                break
                            case 'itemAlreadyRegistered': {
                                messagesToShow[3] = itemAlreadyRegistered
                            }
                                break
                            case 'successMessage': {
                                messagesToShow[4] = successMessage
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
                function validateForm() {
                    let validation = true
                    const validate = {
                        quotationName() {

                            if (
                                quotationName.length &&
                                quotationName.length <= 255 &&
                                quotationName !== null &&
                                quotationName !== undefined
                            ) {
                            } else {
                                validation = false
                                messages.render('quotationNameMessage')
                                return false
                            }
                        },
                        products() {
                            if (!selectedProductsItem.length) {
                                validation = false
                                messages.render('selectProductsMessage')
                            }
                        },
                        providers() {
                            if (!selectedProvidersItem.length) {

                                validation = false
                                messages.render('selectProvidersMessage')
                            }
                        }

                    }

                    validate.products()
                    validate.providers()
                    validate.quotationName()

                    return validation

                }
                async function verifyQuotation() {
                    let validation = true

                    const url = `http://${dataBaseAddress}:${port}/openedQuotations`
                    const res = await fetch(url)
                    
                    const openedQuotations = await res.json()
                    try {
                        openedQuotations.forEach(openedQuotation => {
                            if (openedQuotation.name.toLowerCase() === quotationName.toLowerCase()) throw 'Item Already Registered'
                        })
                    } catch {
                        messages.render('itemAlreadyRegistered')
                        validation = false
                    }

                    return validation
                }

                const render = {
                    rows() {

                        if (selectedProductsItem.length >= selectedProvidersItem.length) {
                            return selectedProductsItem.map((product, i) => {
                                return (
                                    <tr className={styles.bodyRow}>
                                        <td className={styles.tdOfRow}>{product.description}</td>
                                        {render.providers(i)}
                                    </tr>
                                )
                            })
                        } else {
                            return selectedProvidersItem.map((provider, i) => {
                                return (
                                    <tr className={styles.bodyRow}>
                                        {render.products(i)}
                                        <td className={styles.tdOfRow}>{provider.name}</td>
                                    </tr>
                                )
                            })
                        }

                    },
                    products(i) {
                        if (selectedProductsItem[i]) {
                            return (
                                <td className={styles.tdOfRow}>
                                    {selectedProductsItem[i].description}
                                </td>
                            )
                        } else {
                            return (<td></td>)
                        }
                    },
                    providers(i) {
                        if (selectedProvidersItem[i]) {
                            return (
                                <td className={styles.tdOfRow}>
                                    {selectedProvidersItem[i].name}
                                </td>
                            )
                        } else {
                            return (<td></td>)
                        }
                    },
                    form() {
                        return (
                            <form action={`http://${dataBaseAddress}:${port}/openedQuotations/add`} method='POST'
                                className={styles.formAppointment}>

                                <div className={styles.inputNameDiv}>

                                    <label htmlFor="quotationName" style={{ alignSelf: 'flex-start' }}>Nome da cotação</label>
                                    <input
                                        type="text"
                                        name="quotationName"
                                        id="quotationName"
                                        className={styles.inputName}

                                        onChange={e => {
                                            quotationName = e.target.value.trim()
                                            messages.reset()
                                        }}

                                        onClick={e => messages.reset()}
                                        size={255}
                                    />
                                </div>

                                <input type="hidden" name='selectedProducts' value={selectedProductsId} />
                                <input type="hidden" name='selectedProviders' value={selectedProvidersId} />

                                <button type='submit'
                                    className={styles.createQuotationButton}
                                    onClick={async (e) => {
                                        if (!validateForm() || !await verifyQuotation()) {
                                            e.preventDefault()
                                        } else {
                                            messages.render('successMessage')
                                        }
                                    }}>
                                    Criar cotação
                                </button>
                            </form>
                        )
                    }
                }
                const newQuotationWindow = (
                    <div className={styles.newQuotationWindow}>
                        <title>Nova cotação</title>
                        <div className="w-50 h-full borderGray-1px " style={{ borderRight: '0px' }}>
                            <div className={styles.formAndMessagesDiv}>
                                <div id='form'>
                                    {render.form()}
                                </div>

                                <div className={styles.messageDiv} id='divMessages'>

                                </div>

                            </div>

                        </div>
                        <div className='w-95 h-full borderLeftGray-1px overflowAuto' id='mainContainer'>
                            <div className={styles.tableDiv} id='mainContainer'>
                                <Table>
                                    <React.Fragment>
                                        <tr className='borderGray-1px borderLeft-0px'>
                                            <th className={styles.productsHead}>Produtos</th>
                                            <th className={styles.providersHead}>Fornecedores</th>
                                        </tr>
                                    </React.Fragment>
                                    <React.Fragment>
                                        {render.rows()}

                                        <tr className={styles.bodyRow}>
                                            <td className={styles.tdOfRow}>
                                                <div className={styles.externalDivOfSelectButton}>
                                                    <button className={styles.internalDivOfSelectButton}
                                                        onClick={() => ipcRenderer.send('openSelectProductsWindow')}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                        </svg>
                                                    </button>
                                                </div>

                                            </td>
                                            <td className={styles.tdOfRow}>

                                                <div className={styles.externalDivOfSelectButton}>
                                                    <button className={styles.internalDivOfSelectButton}
                                                        onClick={() => ipcRenderer.send('openSelectProvidersWindow')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                </Table>
                            </div>
                        </div>
                    </div>
                )
                ReactDOM.render(newQuotationWindow, document.getElementById('newQuotationWindow'))
            }
            renderPage()
        })
        function shortCuts() {
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Escape') {
                    ipcRenderer.send('closeNewQuotationWindow')
                }
            })
        }
        shortCuts()


    }


    return <div style={{ height: '100%', width: '100%' }} id='newQuotationWindow'>

    </div>


}
export default newQuotationWindow

