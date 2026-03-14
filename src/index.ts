// Importar a biblioteca variáveis de ambiente
import "dotenv/config";
// Importar a biblioteca Express
import express from "express";
// Importar a biblioteca para permitir conexão externa
import cors from "cors";

// Incluir as CONTROLLERS
import AuthController from "./controllers/AuthController.js";
import ProductCategoriesController from "./controllers/ProductCategoriesController.js";
import ProductSituationsController from "./controllers/ProductSituationsController.js";
import SituationsController from "./controllers/SituationsController.js";
import TestConnectionController from "./controllers/TestConnectionController.js";

// Criar a aplicação Express
const app = express();

// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Criar o middleware para permitir reuisição externa
app.use(cors());

// Criar as rotas
app.use("/", AuthController);
app.use("/", TestConnectionController);
app.use("/", SituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ProductSituationsController);

// Iniciar o servidor na porta definida na variável de ambiente
const app_porta = process.env.APP_PORT;
app.listen(app_porta, () => {
  console.log(
    `Servidor iniciado na porta ${app_porta}: http://localhost:${app_porta}`,
  );
});
