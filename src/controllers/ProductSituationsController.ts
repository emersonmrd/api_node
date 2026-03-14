// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { ProductSituation } from "../entity/ProductSituation.js";
// Importar o serviço de paginação
import { PaginationService } from "../services/PaginationService.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para lista as situações dos produtos
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/product-situations?page=1&limit=1
router.get("/product-situations", async (req: Request, res: Response) => {
  try {
    // Obter o repositório da entidade ProductSituation
    const productSituationRepository =
      AppDataSource.getRepository(ProductSituation);

    // Receber o número da página e definir página 1 como padrão
    const page = Number(req.query.page) || 1;

    // Definir o limite de registros por página
    const limit = Number(req.query.limit) || 10;

    // Usar o serviço de paginação
    const result = await PaginationService.paginate(
      productSituationRepository,
      page,
      limit,
      { id: "DESC" },
    );

    // Retorna a resposta com os dados e informações da paginação
    res.status(200).json({ result });
    return;
  } catch (error) {
    res.status(500).json({
      // Retornar erro em caso de falha
      //console.log(error);
      message: "Erro ao listar a situação dos produtos!",
    });
    return;
  }
});

// Rota para visualizar uma situação específica
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/product-situations/:id
router.get(
  "/product-situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Obter o repositório da entidade ProductSituation
      const productSituationRepository =
        AppDataSource.getRepository(ProductSituation);

      // Buscar a situação no banco de dados pelo ID
      const productSituation = await productSituationRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a situação foi encontrada
      if (!productSituation) {
        res.status(404).json({
          message: "Situação do produto não encontrada",
        });
        return;
      }

      // Retornar a situação encontrada
      res.status(200).json(productSituation);
    } catch (error) {
      res.status(500).json({
        // Retornar erro em caso de falha
        //console.log(error);
        message: "Erro ao listar a situação do produto!",
      });
      return;
    }
  },
);

// Criar a rota para cadastrar as situações dos produtos
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/product-situations
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*
{
  "name": "Ativo",
}
*/
router.post("/product-situations", async (req: Request, res: Response) => {
  try {
    // Receber os dados enviados no corpo da requisição
    var data = req.body;

    // Criar uma instância do repositório de ProductCategory
    const productSituationRepository =
      AppDataSource.getRepository(ProductSituation);

    // Criar um novo registro de situação (dados simulados)
    const newProductSituation = productSituationRepository.create(data);

    // Salvar o registro no banco
    await productSituationRepository.save(newProductSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      name: newProductSituation,
    });
  } catch (error) {
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
  }
});

// Criar a rota para editar uma situação específica
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/product-situations/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Ativo"
}
*/
router.put(
  "/product-situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      // Criar uma instância do repositório de ProductSituation
      const productSituationRepository =
        AppDataSource.getRepository(ProductSituation);

      // Buscar a situação de produto no banco de dados pelo ID
      const productSituation = await productSituationRepository.findOneBy({
        id: parseInt(id),
      });

      //Verificar se a situação foi encontrada
      if (!productSituation) {
        res.status(404).json({ message: "Situação não encontrada!" });
        return;
      }

      // Atualizar os dados da situação
      productSituationRepository.merge(productSituation, data);

      // Salvar as alterações no banco de dados
      const updatedProductSituation =
        await productSituationRepository.save(productSituation);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Situação do produto atualizada com sucesso!",
        situation: updatedProductSituation,
      });
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({
        message: "Erro ao atualizar a situação do produto!",
      });
    }
  },
);

// Criar a rota para apagar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/product-situations/:id

router.delete(
  "/product-situations/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da situação do produto a partir dos parâmetros da requisição

      const { id } = req.params;

      // Obter o repositório da entidade ProductSituations

      const productSituationRepository =
        AppDataSource.getRepository(ProductSituation);

      // Buscar a situação produto no banco de dados pelo ID

      const productSituation = await productSituationRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a situação produto foi encontrada

      if (!productSituation) {
        res.status(404).json({ message: "Situação não encontrada!" });
        return;
      }

      // Remover a situação produto do banco de dados
      await productSituationRepository.remove(productSituation);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Situação apagada com sucesso!",
      });
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao apagar a situação do produto!" });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
