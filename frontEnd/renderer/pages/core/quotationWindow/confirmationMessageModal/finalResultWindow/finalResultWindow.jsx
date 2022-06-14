import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from "react";
import ReactDOM, { render } from 'react-dom'
import styles from './finalResultWindow.module.css'

import Table from '../../../../../components/table/table';

function finalResultWindow() {

    if (ipcRenderer) {
        ipcRenderer.send('requestDataOfFinalResult')
        ipcRenderer.on('sendDataOfFinalResultWindow', (e, data) => {
            let allProducts = data.allProducts
            let allProviders = data.allProviders
            let selectedProductsIDsAndPrices = data.selectedProductsIDsAndPrices
            let arrayWithPricesProvidersAndProducts = data.arrayWithPricesProvidersAndProducts
            function renderPage() {
                function getBestPrice(i) {
                    let bestPrice = 9999999999

                    selectedProductsIDsAndPrices[i].forEach(element => {

                        if (typeof element !== 'number') {
                            if (Number(element) === 0) {
                                element = 99999999
                            }
                            element < bestPrice ? bestPrice = Number(element) : ''
                        }
                    })
                    return bestPrice.toFixed(2)

                }
                const render = {
                    bestProviders(i) {
                        let bestPrice = getBestPrice(i)
                        let bestProvider = 1

                        arrayWithPricesProvidersAndProducts.forEach(priceProviderProduct => {

                            if (priceProviderProduct[0] == bestPrice && priceProviderProduct[2] == i) {

                                bestProvider = priceProviderProduct[1]
                            }
                        })

                        arrayWithPricesProvidersAndProducts.forEach(e => {
                            //These loops match the IDs of all selectedProducts with all products in the database.
                            for (const provider of allProviders) {
                                if (provider.id === Number(bestProvider)) {
                                    bestProvider = provider.name
                                }
                            }
                        })
                        return bestProvider
                    },
                    rows() {
                        let allInformationOfSelectedProducts = selectedProductsIDsAndPrices.map(productIDAndPrices => {
                            //These loops match the IDs of all selectedProducts with all products in the database.
                            for (const product of allProducts) {
                                if (product.id === productIDAndPrices[0]) {
                                    return product
                                }
                            }
                        })
                        const result = allInformationOfSelectedProducts.map((product, i) => {

                            return (
                                <tr className={`borderGray-1px w-full`}
                                    key={product.id}>
                                    <td className='borderGray-1px' >
                                        {product.description}
                                    </td>
                                    <td className='borderGray-1px'>
                                        {render.bestProviders(i)}
                                    </td>
                                    <td className='borderGray-1px'>
                                        {`R$ ${getBestPrice(i)}`}
                                    </td>
                                </tr>
                            )
                        })
                        return result
                    }
                }
                const finalResultWindow = (
                    <div className={styles.finalResultWindow}>
                        <title>Resultado Final</title>
                        <Table>
                            <React.Fragment>
                                <tr key={'header'}>
                                    <th className={`borderGray-1px w-40`}>Produto</th>
                                    <th className={`borderGray-1px w-30`}>Melhor fornecedor</th>
                                    <th className={`borderGray-1px w-30`}>Melhor preço</th>
                                </tr>

                            </React.Fragment>
                            <React.Fragment>
                                {render.rows()}
                            </React.Fragment>
                        </Table>
                    </div>
                )
                ReactDOM.render(finalResultWindow, document.getElementById('finalResultWindow'))
            }
            renderPage()
        })
        function shortCuts() {
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Escape') {
                    ipcRenderer.send('closeFinalResultWindow')
                }
            })
        }
        shortCuts()
    }

    return (
        <div style={{ height: '100%', width: '100%' }} id='finalResultWindow'>

        </div>
    )
}
export default finalResultWindow

