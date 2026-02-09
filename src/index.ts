// Importar a biblioteca Express
import express from "express";

// Incluir as CONTROLLERS
import login from "./controllers/login.js";

// Criar a aplicação Express
const app = express();

// Criar as rotas
app.use("/", login);

// Iniciar o servidor na porta 8080
const porta = 8080;
app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}: http://localhost:${porta}`);
});
