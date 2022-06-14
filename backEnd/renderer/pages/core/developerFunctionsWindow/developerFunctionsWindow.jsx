import electron from 'electron'

const ipcRenderer = electron.ipcRenderer || false

function developerFunctionsWindow() {

    function insertDataInMass() {
        let numberOfDataToInsert = 0
        let selectedTable = ''
        return <div>
            <label htmlFor="numberOfDataToInsert"></label>
            <input type="number" id='numberOfDataToInsert' name='numberOfDataToInsert'
                onChange={(e) => numberOfDataToInsert =  e.target.value} />
            <div>
                <p>Lista</p>
                <label htmlFor="radioProducts">Produtos</label>
                <input type="radio" name="table" id="radioProducts" onClick={() => selectedTable = 'products'} />
                <label htmlFor="radioProviders">Fornecedores</label>
                <input type="radio" name="table" id="radioProviders" onClick={() => selectedTable = 'providers'} />
            </div>

            <button onClick={() => {
                ipcRenderer.send('insertData', { numberOfDataToInsert,selectedTable })
            }}>Adicionar dados em massa</button>
        </div>
    }
    return (
        <div>
            {insertDataInMass()}
            <button onClick={() => {
                ipcRenderer.send('resetTables')
            }}>Resetar Tabelas</button>
        </div>
    )
}
export default developerFunctionsWindow