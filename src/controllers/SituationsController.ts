// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { Situation } from "../entity/Situation.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota GET principal
router.get("/situations", async (req: Request, res: Response) => {
  try {
    // Criar uma instância do repositório de Situation
    const situationRepository = AppDataSource.getRepository(Situation);

    // Criar um novo regitro de stiauação (dados simulados)
    const newSituation = situationRepository.create({
      nameSituation: "Ativo", // Valor para simular o cadastro
    });

    // Salvar o registro no banco
    await situationRepository.save(newSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation: newSituation,
    });
  } catch (error) {
    // Retornar erro em caso de falha
    console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
  }
});

// Exportar a instrução que está dentro da constante router
export default router;
