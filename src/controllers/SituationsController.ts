// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { Situation } from "../entity/Situation.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota apra lsitar as situações
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/situations
router.get("/situations", async (req: Request, res: Response) => {
  try {
    // Obter o repositório da entidade Situation
    const situationRepository = AppDataSource.getRepository(Situation);

    // Recupera todas as situações do banco
    const situations = await situationRepository.find();

    // Retorna as situações como resposta
    res.status(200).json(situations);
    return;
  } catch (error) {
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
    return;
  }
});

// Criar a rota para cadastrar a situação
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/situations
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*
{
  "nameSituation": "Ativo",
}
*/
router.post("/situations", async (req: Request, res: Response) => {
  try {
    // Receber os dados enviados no corpo da requisição
    var data = req.body;

    // Criar uma instância do repositório de Situation
    const situationRepository = AppDataSource.getRepository(Situation);

    // Criar um novo regitro de stiauação (dados simulados)
    const newSituation = situationRepository.create(data);

    // Salvar o registro no banco
    await situationRepository.save(newSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation: newSituation,
    });
  } catch (error) {
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
  }
});

// Exportar a instrução que está dentro da constante router
export default router;
