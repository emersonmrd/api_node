// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { ProductSituation } from "../entity/ProductSituation.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota GET principal
router.get("/product-situations", async (req: Request, res: Response) => {
  try {
    // Criar uma instância do repositório de ProductCategory
    const productSituationRepository =
      AppDataSource.getRepository(ProductSituation);

    // Criar um novo registro de situação (dados simulados)
    const newProductSituation = productSituationRepository.create({
      name: "Ativo", // Valor para simular o cadastro
    });

    // Salvar o registro no banco
    await productSituationRepository.save(newProductSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      name: newProductSituation,
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
