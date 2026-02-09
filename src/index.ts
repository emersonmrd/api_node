// Importar a biblioteca Express
import type { Request, Response } from "express";
import express from "express";

// Criar a aplicação Express
const app = express();

// Criar a rota GET principal
app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo celke!");
});

// Iniciar o servidor na porta 8080
const porta = 8080;
app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}: http://localhost:${porta}`);
});
