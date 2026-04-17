// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { ProductCategory } from "../entity/ProductCategory.js";
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

// Criar a rota para listar as categorias dos produtos
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/product-categories?page=1&limit=1
router.get(
  "/product-categories",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // Obter o repositório da entidade ProductCategory
      const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

      // Receber o número da página e definir página 1 como padrão
      const page = Number(req.query.page) || 1;

      // Definir o limite de registros por página
      const limit = Number(req.query.limit) || 10;

      // Usar o serviço de paginação
      const result = await PaginationService.paginate(
        productCategoryRepository,
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
        message: "Erro ao listar as categorias!",
      });
      return;
    }
  },
);

// Criar a rota para visualizar uma categoria específica
// Endereço para acessar a API através da aplicação externa com o verbo GET: http://localhost:8080/product-categories/:id
router.get(
  "/product-categories/:id",
  verifyToken,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da categoria a partir dos parâmetros da requisição
      const { id } = req.params;

      // Obter o repositório da entidade ProductCategory
      const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

      // Buscar a categoria no banco de dados pelo ID
      const productCategory = await productCategoryRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a categoria foi encontrada
      if (!productCategory) {
        res.status(404).json({
          message: "Categoria não encontrada!",
        });
        return;
      }

      // Retornar a categoria encontrada
      res.status(200).json(productCategory);
    } catch (erro) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({
        message: "Erro ao visualizar a categoria!",
      });
    }
  },
);

// Criar a rota para cadastrar as categorias dos produtos
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/product-categories
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*
{
  "name": "Casa",
}
*/
router.post(
  "/product-categories",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // Receber os dados enviados no corpo da requisição
      var data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        name: yup
          .string()
          .required("O campo nome é obrigatório!")
          .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Criar uma instância do repositório de ProductCategory
      const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

      // Recuperar o registro do banco de dados com o valor da coluna name
      const existingProductCategory = await productCategoryRepository.findOne({
        where: { name: data.name },
      });

      //Verfiicar se já eixste uma categoria de produto com o mesmo nome
      if (existingProductCategory) {
        // Retornar resposta
        res.status(400).json({
          message:
            "Já existe uma categoria de produto cadastrada com esse nome!",
        });
        return;
      }

      // Criar um novo registro de Categoria (dados simulados)
      const newProductCategory = productCategoryRepository.create(data);

      // Salvar o registro no banco
      await productCategoryRepository.save(newProductCategory);

      // Retornar resposta de sucesso
      res.status(201).json({
        message: "Categoria cadastrada com sucesso!",
        name: newProductCategory,
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
        message: "Erro ao cadastrar a categoria!",
      });
    }
  },
);

// Criar a rota para editar uma categoria
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/product-categories/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Apartamento"
}
*/
router.put(
  "/product-categories/:id",
  verifyToken,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da categoria a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        name: yup
          .string()
          .required("O campo nome é obrigatório!")
          .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Criar uma instância do repositório de ProductCategory
      const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

      // Buscar a categoria no banco de dados pelo ID
      const productCategory = await productCategoryRepository.findOneBy({
        id: parseInt(id),
      });

      if (!productCategory) {
        res.status(404).json({
          message: "Categoria não encontrada!",
        });
        return;
      }

      // Verificar se já existe outra categoria de produto com o mesmo nome, mas que não seja o registro atual
      const existingSituation = await productCategoryRepository.findOne({
        where: {
          name: data.name,
          id: Not(parseInt(id)), // Exclui o próprio registro da busca
        },
      });

      if (existingSituation) {
        res.status(400).json({
          message:
            "Já existe uma categoria de produto cadastrada com esse nome!",
        });
        return;
      }

      // Atualizar os dados da categoria
      productCategoryRepository.merge(productCategory, data);

      // Salvar as alterações no banco de dados
      const updatedProductCategory =
        await productCategoryRepository.save(productCategory);

      //Retornar resposta de sucesso
      res.status(200).json({
        message: "Categoria atualizada com sucesso!",
        category: updatedProductCategory,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Retornar erros de validação
        res.status(400).json({
          message: error.errors,
        });
        return;
      }
      res.status(500).json({
        // Retornar erro em caso de falha
        //console.log(error);
        message: "Erro ao atualizar categoria!",
      });
    }
  },
);

// Criar a rota para apagar uma situação
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/product-situations/:id

router.delete(
  "/product-categories/:id",
  verifyToken,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da categoria do produto a partir dos parâmetros da requisição

      const { id } = req.params;

      // Obter o repositório da entidade ProductCategory

      const productCategoryRepository =
        AppDataSource.getRepository(ProductCategory);

      // Buscar a categoria do produto no banco de dados pelo ID

      const productCategory = await productCategoryRepository.findOneBy({
        id: parseInt(id),
      });

      // Verificar se a categoria do produto foi encontrada

      if (!productCategory) {
        res.status(404).json({ message: "Situação não encontrada!" });
        return;
      }

      // Remover a categoria do produto do banco de dados
      await productCategoryRepository.remove(productCategory);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Situação apagada com sucesso!",
      });
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao apagar a categoria do produto!" });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
