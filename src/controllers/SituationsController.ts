// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { Situation } from "../entity/Situation.js";
// Importar o serviço de paginação
import { PaginationService } from "../services/PaginationService.js";
// Importar a biblioteca para validar os dados para cadastrar e editar.
import * as yup from "yup";
// Importar o NOT do typeorm
import { Not } from "typeorm";
// Importar o middleware de autenticação
import { verifyToken } from "../middlewares/authMiddleware.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para listar as situações
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/situations?page=1&limit=1
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.get("/situations", verifyToken, async (req: Request, res: Response) => {
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
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.get(
  "/situations/:id",
  verifyToken,
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
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*
{
  "nameSituation": "Ativo",
}
*/
router.post("/situations", verifyToken, async (req: Request, res: Response) => {
  try {
    // Receber os dados enviados no corpo da requisição
    var data = req.body;

    // Validar os dados utilizando o yup
    const schema = yup.object().shape({
      nameSituation: yup
        .string()
        .required("O campo nome é obrigatório!")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
    });

    // Verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });

    // Criar uma instância do repositório de Situation
    const situationRepository = AppDataSource.getRepository(Situation);

    // Recuperar o registro do banco de dados com o valor da coluna nameSituation
    const existingSituation = await situationRepository.findOne({
      where: { nameSituation: data.nameSituation },
    });

    //Verfiicar se já eixste uma situação com o mesmo nome
    if (existingSituation) {
      // Retornar resposta
      res.status(400).json({
        message: "Já existe uma situação cadastrada com esse nome!",
      });
      return;
    }

    // Criar um novo regitro de situação (dados simulados)
    const newSituation = situationRepository.create(data);

    // Salvar o registro no banco
    const situation = await situationRepository.save(newSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // Retornar erros de validação
      res.status(400).json({
        message: error.errors,
      });
      return;
    }
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
  }
});

// Criar a rota para editar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/situations/:id
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "nameSituation": "Ativo"
}
*/
router.put(
  "/situations/:id",
  verifyToken,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        nameSituation: yup
          .string()
          .required("O campo nome é obrigatório!")
          .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

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

      // Verificar se já existe outra situação com o mesmo nome, mas que não seja o registro atual
      const existingSituation = await situationRepository.findOne({
        where: {
          nameSituation: data.nameSituation,
          id: Not(parseInt(id)), // Exclui o próprio registro da busca
        },
      });

      if (existingSituation) {
        res.status(400).json({
          message: "Já existe uma situação cadastrada com esse nome!",
        });
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
      if (error instanceof yup.ValidationError) {
        // Retornar erros de validação
        res.status(400).json({
          message: error.errors,
        });
        return;
      }
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({ message: "Erro ao editar a situação id" });
    }
  },
);

// Criar a rota para apagar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/situations/:id
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.delete(
  "/situations/:id",
  verifyToken,
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
