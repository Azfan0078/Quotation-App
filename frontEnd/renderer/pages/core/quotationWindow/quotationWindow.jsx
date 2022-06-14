import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from "react";
import ReactDOM from 'react-dom';

import styles from './quotationWindow.module.css'

import Table from '../../../components/table/table'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'

function mainWindowOfQuotation() {

    let finalResult = []

    if (ipcRenderer) {
        let selectedProductsItem
        let selectedProvidersItem
        let quotationName
        let quotationID

        ipcRenderer.on('refreshFinalResult', (e, finalResultFromConfirmationMessageModal) => {
            finalResult = finalResultFromConfirmationMessageModal
        })

        ipcRenderer.send('requestSelectedQuotation')

        ipcRenderer.on('sendSelectedQuotation', (e, selectedQuotation) => {
            function renderPage() {
                selectedProductsItem = selectedQuotation.selectedProducts
                selectedProvidersItem = selectedQuotation.selectedProviders
                quotationName = selectedQuotation.quotationName
                quotationID = selectedQuotation.quotationID

                const render = {
                    products() {
                        if (selectedProductsItem) {
                            return selectedProductsItem.map((product, i) => {
                                return (
                                    <React.Fragment>
                                        <tr id={product.id} key={product.description}>
                                            <td key={product.id}
                                                style={{ padding: '3px 0px 3px 5px' }}
                                                className={`borderGray-1px`}>
                                                {product.description}
                                            </td>
                                            {render.prices(i)}
                                        </tr>
                                    </React.Fragment>
                                )
                            })
                        }

                    },
                    providers() {
                        if (selectedProvidersItem) {
                            return selectedProvidersItem.map(provider => {

                                return (
                                    <td key={provider.id} className={`borderGray-1px paddingLeft-5px`}>{provider.name}</td>
                                )
                            })
                        }


                    },
                    prices(indexOfProductsLoop) {
                        if (selectedProvidersItem) {
                            return selectedProvidersItem.map((provider, indexOfProvidersLoop) => {
                                return (
                                    <td key={provider.id} id={provider.id} className='textAlign-center borderGray-1px'>
                                        <Input type='number'
                                            className={styles.priceInput}
                                            key={`${indexOfProductsLoop}${indexOfProvidersLoop}`}
                                            placeHolder={'R$ 0.00'}
                                            id={`${indexOfProductsLoop}${indexOfProvidersLoop}`}

                                            onChange={e => {
                                                const inputOfPrice = e.target
                                                let price = Number(inputOfPrice.value).toFixed(2)
                                                if (!price) {
                                                    price = 0
                                                }
                                                const idOfInput = Number(e.target.id)
                                                const productID = inputOfPrice.parentNode.parentNode.id
                                                const providerID = inputOfPrice.parentNode.id

                                                finalResult[idOfInput] = [price, providerID, `${productID}|`]

                                            }}></Input>
                                    </td>
                                )
                            })
                        }

                    }
                }

                const quotationWindow = (
                    <div className={styles.quotationWindow}>
                        <title>Cotação</title>
                        <div className='overflowAuto'>
                            <Table className={styles.table}>
                                <React.Fragment>
                                    <tr key='head'>
                                        <td key='products' className={`borderGray-1px w-80 paddingLeft-5px`}>Produto</td>
                                        {render.providers()}
                                    </tr>
                                </React.Fragment>
                                <React.Fragment>
                                    {render.products()}
                                </React.Fragment>
                            </Table>
                        </div>
                        <div className={styles.buttonsDiv}>

                            <Button onClick={(e) => {
                                if (validate()) {
                                    ipcRenderer.send('finalizeQuotation', { quotationID, quotationName, finalResult })
                                    quotationID = null
                                    quotationName = null
                                    finalResult = []
                                }
                            }}>
                                <u>F</u>inalizar Cotação
                            </Button>

                            <Button
                                onClick={() => ipcRenderer.send('openSelectQuotationWindow')}>
                                <u>S</u>elecionar cotação
                            </Button>
                        </div>
                    </div>

                )
                ReactDOM.unmountComponentAtNode(document.getElementById('quotationWindow'))
                ReactDOM.render(quotationWindow, document.getElementById('quotationWindow'))
            }
            renderPage()
        })
        ipcRenderer.on('requestFinalizeQuotation', () => {
            if (validate()) ipcRenderer.send('finalizeQuotation', { quotationID, quotationName, finalResult })
        })
        function validate() {
            let validated = false
            if (finalResult.length) {
                validated = true
            }
            return validated
        }
    }

    return (
        <div style={{ height: '100%', width: '100%' }} id='quotationWindow'>

        </div>
    )
}
export default mainWindowOfQuotation



