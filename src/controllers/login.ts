// Importar a biblioteca Express
import type { Request, Response } from "express";
import express from "express";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo Celke!");
});

// Exportar a instrução que está dentro da constante router
export default router;
