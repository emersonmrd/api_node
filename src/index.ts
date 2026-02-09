// Importar a biblioteca variáveis de ambiente
import "dotenv/config";

// Importar a biblioteca Express
import express from "express";

// Incluir as CONTROLLERS
import login from "./controllers/login.js";

// Criar a aplicação Express
const app = express();

// Criar as rotas
app.use("/", login);

// Iniciar o servidor na porta definida na variável de ambiente
const app_porta = process.env.APP_PORT;
app.listen(app_porta, () => {
  console.log(
    `Servidor iniciado na porta ${app_porta}: http://localhost:${app_porta}`,
  );
});
