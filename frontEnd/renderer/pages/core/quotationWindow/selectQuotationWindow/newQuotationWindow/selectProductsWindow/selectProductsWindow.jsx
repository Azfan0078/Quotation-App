const electron = require('electron')
const ipcRenderer = electron.ipcRenderer || false;

import React from 'react'
import ReactDOM from 'react-dom';
import styles from './selectProductsWindow.module.css'

import Table from '../../../../../../components/table/table'
import Button from '../../../../../../components/button/button';
let numberOnHover = 0

function selectProductsWindow() {
    const selectedProducts = []
    if (ipcRenderer) {
        ipcRenderer.send('requestAllProducts')
        ipcRenderer.on('sendAllProducts', (e, products) => {
            ipcRenderer.on('shortcutRemove',() => shortCuts.remove())
            function addSelectedProduct(row) {
                const id = Number(row.id)

                if (!row.selected) {
                    row.classList.add(styles.selected)
                    selectedProducts.push(id)
                } else {
                    row.classList.remove(styles.selected)
                    const idIndexInSelectedProducts = selectedProducts.indexOf(id)
                    selectedProducts.splice(idIndexInSelectedProducts, 1)
                }

                ipcRenderer.send('sendSelectedProducts', selectedProducts)

                row.selected = !row.selected
            }
            const hover = {
                add(numberToHover) {
                    console.log(products)
                    if (numberToHover < 0) numberOnHover = 0

                    if (numberToHover >= products.length) numberOnHover = products.length - 1

                    console.log(numberOnHover)
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
                                    hover={i}
                                    selected={false}
                                    onDoubleClick={product => {
                                        const row = product.target.parentNode
                                        addSelectedProduct(row)
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
                const selectProducts = (
                    <div className={styles.selectProducts}>
                        <title>Selecionar Produtos</title>

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


                        <Button
                            onClick={() => {
                                shortCuts.remove()
                                ipcRenderer.send('openRegisterProductsWindow')
                            }}>
                            <u>C</u>adastrar Produtos
                        </Button>

                    </div>
                )
                ReactDOM.unmountComponentAtNode(document.getElementById('selectProducts'))
                ReactDOM.render(selectProducts, document.getElementById('selectProducts'))
                hover.add(0)
            }
            renderPage()


            function keyDown(e) {

                switch (e.code) {
                    case 'Space': {
                        const tableBody = document.getElementById('tableBody')
                        const tableBodyRows = [...tableBody.children]
                        const row = tableBodyRows[numberOnHover]
                        addSelectedProduct(row)
                        numberOnHover++
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
                        ipcRenderer.send('closeSelectProductsWindow')
                    } break
                }
            }

            const shortCuts = {
                add() {
                    window.addEventListener('keydown', keyDown)
                },
                remove() {
                    window.removeEventListener('keydown', keyDown)
                }
            }
            shortCuts.add()
            hover.add(0)
        })
    }

    return (
        <div style={{ height: "100%", width: "100%" }} id='selectProducts'>

        </div>

    )

}
export default selectProductsWindow

