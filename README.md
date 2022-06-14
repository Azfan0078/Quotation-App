# Quotation-App

Quotation-app é um aplicativo desenvolvido para ajudar "compradores" a fazerem compras realizando cotações entre diversos produtos e fornecedores.
Ele funciona através do cadastro dos fornecedores e produtos, o que faz tudo funcionar de forma mais rápida pois uma vez que você cadastra um produto ou fornecedor, é possível utiliza-los em diversas cotações, tornando
muito mais fácil o processo de cotação.

## Dependências
* Windows
* MySQL

## Como instalar
A primeira coisa a se fazer é instalar o MySQL caso ainda não o tenha instalado no computador
Link para download do MySQL: <https://dev.mysql.com/downloads/installer/>.

Após a instalação acesse o mysql através do terminal ou do próprio mySQL command line client
e crie um banco de dados usando o comando: ``` CREATE DATABASE "nome do bando de dados";```

Pronto, banco de dados criado, agora vamos instalar o aplicativo:<br/>
Link para o arquivo de instalação: <https://mega.nz/file/Sh923KQa#EIE1ZlqV_AdEpFzO-MHT51HWYCZjPzcJUV5wcx6wch8><br/>

Com o arquivo baixado, podemos instalar o aplicativo usando o instalador .
![Arquivo do instalador](./images/Imagem%20instalando%20pelo%20instalador.png)<br/>
Ou podemos abri-lo direto na pasta "win-unpacked".<br/>
![Arquivo do instalador](./images/Imagem%20usando%20pelo%20win-unpacked.png)
![Abrindo pelo win-unpacked](./images/Abrindo%20pelo%20win-unpacked.png)<br/>
O mesmo vale, tanto para o frontEnd quanto para o backEnd.

## Como configurar

### Configuração Back-end
Após o aplicativo estar pronto para ser aberto, abriremos primeiro o servidor que nos trará a seguinte tela de configuração:

![Tela de configuração do backEnd](./images/Tela%20configura%C3%A7%C3%A3o%20back-end.png)
* No campo "Nome do banco de dados" coloque o mesmo nome que você colocou ao criar um banco de dados.
* Agora no campo "Senha do banco de dados" coloque a senha de root do seu mySQL.
* E por fim na aba "Porta do servidor" coloque o numero de uma porta não utilizada no seu computador, um exemplo: "51235".
### Configuração Front-end
Após ter configurado o servidor back-end e com ele rodando, abra o aplicativo do lado front-end, este arquivo abrirá esta tela:

![Tela de configuração do frontEnd](./images/Tela%20configura%C3%A7%C3%A3o%20front-end.png)
* No campo "Endereço do banco de dados" coloque o id da maquina onde está aberto o arquivo do servidor, o id pode ser adquirido através do comando ```ipconfig``` no cmd,basta procurar por Endereço ipv4.
* Por fim, no campo "Porta do banco de dados" basta colocar a mesma porta que foi usada na configuração do back-end, no nosso caso "51235".<br/>

## Utilizando o app
Depois de instalado e configurado, é muito simples utilizar o app.
* Primeiro é preciso cadastrar os produtos e os fornecedores que você ira cotar, lembrando que os mesmos ficaram salvos no banco de dados e excluir e editar é totalmente possível.
* Depois você escolhe quais produtos e fornecedores faram parte da cotação, e da um nome a sua cotação
* E por ultimo, basta colocar os preços dos produtos e finalizar sua cotação.

### Video com a utilização do aplicativo
<https://youtu.be/nkuEq8czYTw>






