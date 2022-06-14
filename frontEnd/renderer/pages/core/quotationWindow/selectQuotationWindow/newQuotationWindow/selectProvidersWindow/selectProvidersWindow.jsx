const electron = require('electron')
const ipcRenderer = electron.ipcRenderer || false;

import React from 'react'
import ReactDOM from 'react-dom';
import styles from './selectProvidersWindow.module.css'

import Table from '../../../../../../components/table/table'
import Button from '../../../../../../components/button/button';

let numberOnHover = 0
function selectProvidersWindow() {
    const selectedProviders = []
    if (ipcRenderer) {
        ipcRenderer.send('requestAllProviders')
        ipcRenderer.on('sendAllProviders', (e, providers, execShortcuts) => {
            ipcRenderer.on('shortcutRemove',() => shortCuts.remove())
            function addSelectedProvider(row) {

                const id = Number(row.id)
                if (!row.selected) {
                    row.classList.add(styles.selected)
                    selectedProviders.push(id)
                } else {
                    row.classList.remove(styles.selected)
                    const idIndexInSelectedProviders = selectedProviders.indexOf(id)
                    selectedProviders.splice(idIndexInSelectedProviders, 1)
                }
                ipcRenderer.send('sendSelectedProviders', selectedProviders)

                row.selected = !row.selected
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
                                        addSelectedProvider(row)
                                    }}
                                    onClick={(provider) => {
                                        const row = provider.target.id
                                        numberOnHover = row
                                        hover.remove()
                                        hover.add(numberOnHover)
                                    }}>

                                    <td className={styles.bodyTd} id={i}>{provider.id}</td>
                                    <td className={styles.bodyTd} id={i}>{provider.name}</td>
                                </tr >
                            )
                        })

                        return result
                    }
                }

                const selectProvidersDiv = (
                    <div className={styles.selectProviders}>
                        <title>Selecionar fornecedores</title>
                        <Table IDOfTbody='tableBody'>
                            <React.Fragment>
                                <tr>
                                    <td className={styles.tdHead} style={{ width: '10%' }}>ID</td>
                                    <td className={styles.tdHead} style={{ width: '90%' }}>Nome</td>

                                </tr>
                            </React.Fragment>
                            <React.Fragment>
                                {renderProviders()}
                            </React.Fragment>
                        </Table>

                        <Button
                            onClick={() => {
                                shortCuts.remove()
                                ipcRenderer.send('openRegisterProvidersWindow')}}>
                            <u>C</u>adastrar Fornecedores
                        </Button>
                    </div>

                )
                ReactDOM.unmountComponentAtNode(document.getElementById('selectProvidersDiv'))
                ReactDOM.render(selectProvidersDiv, document.getElementById('selectProvidersDiv'))
                

            }
            renderPage()

            function keyDown(e) {
                switch (e.code) {
                    case 'Space': {
                        const tableBody = document.getElementById('tableBody')
                        const tableBodyRows = [...tableBody.children]
                        const row = tableBodyRows[numberOnHover]
                        addSelectedProvider(row)
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
                        ipcRenderer.send('closeSelectProvidersWindow')
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
        <div style={{ height: '100%', width: "100%" }} id='selectProvidersDiv'>

        </div>
    )

}
export default selectProvidersWindow


