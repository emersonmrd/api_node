// Importar a biblioteca variáveis de ambiente
import "dotenv/config";
// Importar a biblioteca Express
import express from "express";
// Importar a biblioteca para permitir conexão externa
import cors from "cors";

// Incluir as CONTROLLERS
import TestConnectionController from "./controllers/TestConnectionController.js";
import AuthController from "./controllers/AuthController.js";
import UsersController from "./controllers/UsersController.js";
import SituationsController from "./controllers/SituationsController.js";
import ProductController from "./controllers/ProductController.js";
import ProductSituationsController from "./controllers/ProductSituationsController.js";
import ProductCategoriesController from "./controllers/ProductCategoriesController.js";
import ReportsController from "./controllers/ReportsController.js";

// Criar a aplicação Express
const app = express();

// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Criar o middleware para permitir reuisição externa
app.use(cors());

// Criar as rotas
app.use("/", TestConnectionController);
app.use("/", AuthController);
app.use("/", UsersController);
app.use("/", SituationsController);
app.use("/", ProductController);
app.use("/", ProductSituationsController);
app.use("/", ProductCategoriesController);
app.use("/", ReportsController);

// Iniciar o servidor na porta definida na variável de ambiente
const app_porta = process.env.APP_PORT;
app.listen(app_porta, () => {
  console.log(
    `Servidor iniciado na porta ${app_porta}: http://localhost:${app_porta}`,
  );
});
