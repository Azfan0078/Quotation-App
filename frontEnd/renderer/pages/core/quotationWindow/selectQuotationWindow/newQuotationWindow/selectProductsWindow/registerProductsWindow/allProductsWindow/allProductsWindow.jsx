import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from 'react'
import ReactDOM from 'react-dom'

import styles from './allProductsWindow.module.css'

import Table from '../../../../../../../../components/table/table'

let numberOnHover = 0
function allProductsWindow() {
    if (ipcRenderer) {
        ipcRenderer.send('requestAllProductsOfAllProductsWindow')
        ipcRenderer.on('sendAllProductsOfAllProductsWindow', (e, products) => {
            function selectProduct(row) {
                const id = Number(row.id)
                ipcRenderer.send('sendSelectedProduct', id)

            }
            const hover = {
                add(numberToHover) {
                    if (numberToHover < 0) numberOnHover = 0

                    if (numberToHover >= products.length) numberOnHover = products.length - 1

                    const tableBody = document.getElementById('tableBody')

                    const tableBodyRows = [...tableBody.children]

                    const parent = tableBodyRows[numberOnHover]

                    if (parent) parent.classList.add(styles.hover)

                },
                remove() {

                    const tableBody = document.getElementById('tableBody')
                    const tableBodyRows = [...tableBody.children]

                    tableBodyRows.forEach(row => {
                        row.classList.remove(styles.hover)
                    })

                }
            }

            function renderPage() {
                function renderProducts() {

                    if (products && products.length) {
                        const result = products.map((product, i) => {
                            return (
                                <tr
                                    id={product.id}
                                    key={product.id}
                                    selected={false}
                                    onDoubleClick={product => {
                                        const row = product.target.parentNode
                                        selectProduct(row)
                                    }}
                                    onClick={(product) => {
                                        const row = product.target.id
                                        numberOnHover = row
                                        hover.remove()
                                        hover.add(numberOnHover)
                                    }}>

                                    <td className={styles.bodyTd} id={i}>{product.id}</td>
                                    <td className={styles.bodyTd} id={i}>{product.barCode}</td>
                                    <td className={styles.bodyTd} id={i}>{product.description}</td>
                                    <td className={styles.bodyTd} id={i}>{product.lastBuyPrice}</td>
                                </tr>
                            )
                        })
                        return result

                    }
                }

                const allProductsWindow = (
                    <div className={styles.allProductsWindow}>
                        <title>Selecionar Produto</title>

                        <div className='overflowAuto w-full'>
                            <Table IDOfTbody='tableBody'>
                                <React.Fragment>
                                    <tr>
                                        <td className={styles.tdHead} style={{ width: '10%' }}>ID</td>
                                        <td className={styles.tdHead} style={{ width: '25%' }}>Código de barra</td>
                                        <td className={styles.tdHead} style={{ width: '50%' }}>Descrição</td>
                                        <td className={styles.tdHead} style={{ width: '20%' }}>UPP</td>
                                    </tr>
                                </React.Fragment>
                                <React.Fragment>
                                    {renderProducts()}
                                </React.Fragment>
                            </Table>
                        </div>

                    </div>
                )
                ReactDOM.unmountComponentAtNode(document.getElementById('allProductsWindow'))
                ReactDOM.render(allProductsWindow, document.getElementById('allProductsWindow'))
                hover.add(numberOnHover)
            }
            renderPage()
            function keyDown(e) {
                switch (e.code) {
                    case 'Space': case 'Enter': {
                        const tableBody = document.getElementById('tableBody')
                        const tableBodyRows = [...tableBody.children]
                        const row = tableBodyRows[numberOnHover]
                        selectProduct(row)

                        hover.remove()
                        hover.add(numberOnHover)
                    } break
                    case 'ArrowUp': {
                        if (numberOnHover > 0) numberOnHover--

                        hover.remove()

                        hover.add(numberOnHover)
                    } break
                    case 'ArrowDown': {
                        numberOnHover++

                        hover.remove()

                        hover.add(numberOnHover)
                    } break
                    case 'Escape': {
                        ipcRenderer.send('closeAllProductsWindow')
                    }
                }
            }
            const shortCuts = {
                add() {
                    window.addEventListener('keydown', keyDown)
                }
            }
            shortCuts.add()
            hover.add(0)
        })
    }
    return (
        <div style={{ height: '100%', width: '100%' }} id='allProductsWindow'>

        </div>
    )
}
export default allProductsWindow