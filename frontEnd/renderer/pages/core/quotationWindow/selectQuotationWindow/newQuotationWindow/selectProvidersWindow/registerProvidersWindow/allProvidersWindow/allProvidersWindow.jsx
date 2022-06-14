import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from 'react'
import ReactDOM from 'react-dom'

import styles from './allProvidersWindow.module.css'

import Table from '../../../../../../../../components/table/table'

let numberOnHover = 0
function allProvidersWindow() {
    if (ipcRenderer) {
        ipcRenderer.send('requestAllProvidersOfAllProvidersWindow')
        ipcRenderer.on('sendAllProvidersOfAllProvidersWindow', (e, providers) => {
            function selectProvider(row) {
                const id = Number(row.id)
                ipcRenderer.send('sendSelectedProvider', id)
            }
            const hover = {
                add(numberToHover) {
                    if (numberToHover < 0) numberOnHover = 0

                    if (numberToHover >= providers.length) numberOnHover = providers.length - 1

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
                function renderProviders() {

                    if (providers && providers.length) {
                        const result = providers.map((provider, i) => {
                            return (
                                <tr
                                    id={provider.id}
                                    key={provider.id}
                                    selected={false}
                                    onDoubleClick={provider => {
                                        const row = provider.target.parentNode
                                        selectProvider(row)
                                    }}
                                    onClick={(provider) => {
                                        const row = provider.target.id
                                        numberOnHover = row
                                        hover.remove()
                                        hover.add(numberOnHover)
                                    }}>

                                    <td className={styles.bodyTd} id={i}>{provider.id}</td>
                                    <td className={styles.bodyTd} id={i}>{provider.name}</td>
                                </tr>
                            )
                        })
                        return result

                    }
                }
                const allProvidersWindow = (
                    <div className={styles.allProvidersWindow}>
                        <title>Selecionar Produto</title>

                        <div className='overflowAuto w-full'>
                            <Table IDOfTbody='tableBody'>
                                <React.Fragment>
                                    <tr>
                                        <td className={styles.tdHead} style={{ width: '10%' }}>ID</td>
                                        <td className={styles.tdHead} style={{ width: '90%' }}>Nome do Fornecedor</td>

                                    </tr>
                                </React.Fragment>
                                <React.Fragment>
                                    {renderProviders()}
                                </React.Fragment>
                            </Table>
                        </div>

                    </div>
                )
                ReactDOM.unmountComponentAtNode(document.getElementById('allProvidersWindow'))
                ReactDOM.render(allProvidersWindow, document.getElementById('allProvidersWindow'))

            }
            renderPage()

            function keyDown(e) {
                switch (e.code) {
                    case 'Enter' || 'Space': {
                        const tableBody = document.getElementById('tableBody')
                        const tableBodyRows = [...tableBody.children]
                        const row = tableBodyRows[numberOnHover]
                        selectProvider(row)

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
                        ipcRenderer.send('closeAllProvidersWindow')
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
        <div id="allProvidersWindow" style={{ height: '100%', width: '100%' }}>

        </div>
    )
}
export default allProvidersWindow