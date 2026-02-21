// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { ProductCategory } from "../entity/ProductCategory.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para listar as categorias dos produtos
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/product-categories
router.get("/product-categories", async (req: Request, res: Response) => {
  try {
    // Obter o repositório da entidade ProductCategory
    const productCategoryRepository =
      AppDataSource.getRepository(ProductCategory);

    // Recupera todas as situações do banco
    const productCategories = await productCategoryRepository.find();

    // Retorna as situações como resposta
    res.status(200).json(productCategories);
    return;
  } catch (error) {
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao listar as categorias!",
    });
    return;
  }
});

// Criar a rota para visualizar uma categoria específica
// Endereço para acessar a API através da aplicação externa com o verbo GET: http://localhost:8080/product-categories/:id
router.get(
  "/product-categories/:id",
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
router.post("/product-categories", async (req: Request, res: Response) => {
  try {
    // Receber os dados enviados no corpo da requisição
    var data = req.body;
    // Criar uma instância do repositório de ProductCategory
    const productCategoryRepository =
      AppDataSource.getRepository(ProductCategory);

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
    // Retornar erro em caso de falha
    //console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar a categoria!",
    });
  }
});

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
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Obter o ID da categoria a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

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
      res.status(500).json({
        message: "Erro ao atualizar categoria!",
      });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
