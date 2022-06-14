import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false

import React from 'react'
import ReactDOM from 'react-dom'

import style from './registerProvidersWindow.module.css'

import Message from '../../../.././../../../components/message/message'

function registerProvidersWindow() {
    let name = ''

    if (ipcRenderer) {
        const dataBaseAddressAndPort = ipcRenderer.sendSync('reqDataBaseAddressAndPort')
        const dataBaseAddress = dataBaseAddressAndPort.dataBaseAddress
        const port = dataBaseAddressAndPort.port

        ipcRenderer.send('requestSelectedProvider')
        ipcRenderer.on('sendProvider', (e, selectedProviderID = null) => {
            let messagesToShow = []

            let providerID
            let addOrEdit = 'add'
            let labelButton = 'Salvar'
            let deleteButtonDisabled = true

            const message = {
                render(message) {
                    let successLabel = 'Fornecedor salvo com sucesso'

                    if (addOrEdit === 'edit') {
                        successLabel = 'Fornecedor editado com sucesso'
                    }
                    const itemAlreadyRegisteredMessage = <Message
                        visible={true}
                        label="Fornecedor já salvo, verifique os dados!"
                        className='bgRed'
                    />
                    const successMessage = <Message
                        visible={true}
                        label={successLabel}
                        className='bgGreen'
                    />
                    const nameMessage = <Message
                        visible={true}
                        label='Nome inválido'
                        className='bgRed'
                    />
                    const providerInUseMessage = <Message
                        visible={true}
                        label='Há uma ou mais cotações utilizando este fornecedor'
                        className='bgRed'
                    />
                    const providerDeleted = <Message
                        visible={true}
                        label='Fornecedor deletado com sucesso'
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
                        case 'nameError': {
                            messagesToShow[2] = nameMessage
                        } break
                        case 'providerInUse': {
                            messagesToShow[4] = providerInUseMessage
                        }
                            break
                        case 'providerDeleted': {
                            messagesToShow[5] = providerDeleted
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

            if (selectedProviderID) {
                addOrEdit = 'edit'
                labelButton = 'Editar'
                deleteButtonDisabled = false
                const providers = ipcRenderer.sendSync('requestProviders')
                const form = document.getElementById('providerForm')
                const inputNameAndSelectProviderButton = form.children[1]
                const inputName = inputNameAndSelectProviderButton.children[0]

                providers.forEach(provider => {
                    if (provider.id === selectedProviderID) {

                        name = provider.name
                        providerID = provider.id

                        inputName.value = provider.name

                    }
                })
            }
            ipcRenderer.on('providerInUsed', (e, deleted) => {
                if (deleted) {
                    name = ''
                    providerID = ''
                    addOrEdit = 'add'
                    labelButton = 'Salvar'
                    deleteButtonDisabled = true
                    document.getElementById('name').value = ''

                    message.render('providerDeleted')
                    renderPage()
                }
                else {
                    message.render('providerInUse')
                }


            })
            function renderPage() {

                function validateForm() {
                    let validation = true
                    function verifyName() {
                        if (!name ||
                            name == null ||
                            name == undefined) {
                            message.render('nameError')
                            validation = false
                        }
                    }
                    verifyName()

                    return validation
                }
                async function verifyProvider() {
                    let validation = true

                    if (!selectedProviderID) {
                        const providers = ipcRenderer.sendSync('requestProviders')
                        for (let provider of providers) {
                            if (provider.name === name) {
                                message.render('itemAlreadyRegistered')
                                validation = false
                                break
                            }
                        }
                    }
                    
                    return validation
                }
                const registerProviders = (
                    <div className={style.registerProviders}>
                        <title>Registrar Fornecedor</title>
                        <div className={style.internalGlobalDiv}>


                            <form action={`http://${dataBaseAddress}:${port}/providers/${addOrEdit}`} id='providerForm' className={style.form} method='POST'>
                                <label htmlFor="name">Nome do fornecedor</label>
                                <div className={style.divInputName}>

                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        className={style.input}
                                        onChange={e => {
                                            name = e.target.value
                                            message.reset()
                                        }}
                                        onClick={() => {
                                            message.reset()
                                        }} />
                                    <span className={style.span}>
                                        <div className={style.externalDivOfSelectButton}>
                                            <button type='button' className={style.internalDivOfSelectButton}
                                                onClick={() => ipcRenderer.send('openAllProvidersWindow')}>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </span>
                                </div>
                                <input type="hidden" value={providerID} name='id' />
                                <div>
                                    <button
                                        type='submit'
                                        id='submitButton'
                                        className={style.saveButton}
                                        onClick={async (e) => {
                                            if (! await validateForm() || ! await verifyProvider()) {
                                                e.preventDefault()
                                            } else {
                                                message.render('successMessage')
                                                
                                            }
                                        }} >{labelButton}</button>
                                    <button type='button'
                                        style={{ marginLeft: '5px' }} disabled={deleteButtonDisabled}
                                        onClick={(e) => ipcRenderer.send('deleteProvider', providerID)}>Excluir</button>
                                </div>

                            </form>
                            <div className={style.divMessages} id='divMessages'>
                            </div>
                        </div>
                    </div>
                )

                ReactDOM.render(registerProviders, document.getElementById("registerProviders"))
            }
            renderPage()
            function shortCuts() {
                window.addEventListener('keydown', (e) => {
                    if (e.code === 'Escape') {
                        ipcRenderer.send('closeRegisterProvidersWindow')
                    }
                })
            }
            shortCuts()
        })

    }

    return (
        <div style={{ height: '100%', width: '100%' }} id='registerProviders'>
        </div>
    )

}
export default registerProvidersWindow