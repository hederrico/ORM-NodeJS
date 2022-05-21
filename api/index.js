const express = require("express");
const routes = require('./routes');

//Instância do express
const app = express();
//Porta utilizada
const port = 3000;

//Inicialização das rotas passando app
routes(app);

//Coloca o sistema para ouvir na porta 3000 e exibe uma mensagem no terminal
app.listen(port, () => console.log(`Servidor está rodando na porta ${port}`));

module.exports = app;