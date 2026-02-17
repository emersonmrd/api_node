// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { ProductCategory } from "../entity/ProductCategory.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota apra lsitar as categorias dos produtos
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
      message: "Erro ao cadastrar a categoria!",
    });
    return;
  }
});

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

// Exportar a instrução que está dentro da constante router
export default router;
