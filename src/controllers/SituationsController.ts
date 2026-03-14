// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { Situation } from "../entity/Situation.js";
// Importar o serviço de paginação
import { PaginationService } from "../services/PaginationService.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para listar as situações
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/situations?page=1&limit=1
router.get("/situations", async (req: Request, res: Response) => {
  try {
    // Obter o repositório da entidade Situation
    const situationRepository = AppDataSource.getRepository(Situation);

    // Receber o número da página e definir página 1 como padrão
    const page = Number(req.query.page) || 1;

    // Definir o limite de registros por página
    const limit = Number(req.query.limit) || 10;

    // Usar o serviço de paginação
    const result = await PaginationService.paginate(
      situationRepository,
      page,
      limit,
      { id: "DESC" },
    );

    // Retorna a resposta com os dados e informações da paginação
    res.status(200).json(result);
    return;
  } catch (error) {
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao listar a situação!",
    });
    return;
  }
});

// Rota para visualizar uma situação específica
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/situations/:id
router.get(
  "/situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Obter o repositório da entidade Situation
      const situationRepository = AppDataSource.getRepository(Situation);

      // Buscar a situação no banco de dados pelo ID
      const situation = await situationRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a situação foi encontrada
      if (!situation) {
        res.status(404).json({
          message: "Situação não encontrada!",
        });
        return;
      }
      // Retornar a situação encontrada
      res.status(200).json(situation);
      return;
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({
        message: "Erro ao visualizar a situação.",
      });
    }
  },
);

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

// Criar a rota para editar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/situations/:id
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "nameSituation": "Ativo"
}
*/
router.put(
  "/situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição

      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição

      const data = req.body;

      // Obter o repositório da entidade Situation

      const situationRepository = AppDataSource.getRepository(Situation);

      // Buscar a situação no banco de dados pelo ID
      const situation = await situationRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a situação foi encontrada
      if (!situation) {
        res.status(404).json({ message: "Situação não encontrada!" });
        return;
      }

      // Atualizar os dados da situação
      situationRepository.merge(situation, data);

      // Salvar as alterações no banco de dados
      const updateSituation = await situationRepository.save(situation);

      // Retornar a resposta de sucesso
      res.status(200).json({
        message: "Situação atualizada com sucesso!",
        situation: updateSituation,
      });
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({ message: "Erro ao editar a situação id" });
    }
  },
);

// Criar a rota para apagar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/situations/:id

router.delete(
  "/situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição

      const { id } = req.params;

      // Obter o repositório da entidade Situation

      const situationRepository = AppDataSource.getRepository(Situation);

      // Buscar a situação no banco de dados pelo ID

      const situation = await situationRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a situação foi encontrada

      if (!situation) {
        res.status(404).json({ message: "Situação não encontrada!" });
        return;
      }

      // Remover a situação do banco de dados
      await situationRepository.remove(situation);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Situação apagada com sucesso!",
      });
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({ message: "Erro ao apagar a situação!" });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
