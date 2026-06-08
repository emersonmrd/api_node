// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { User } from "../entity/User.js";
// Improtar a entidade situation
import { Product } from "../entity/Product.js";
// Importar a biblioteca para subtrair meses
import { subMonths, format } from "date-fns";
// Importar a biblioteca para locale em português diretamente
import { ptBR } from "date-fns/locale/pt-BR";
// Importar o middleware de autenticação
import { verifyToken } from "../middlewares/authMiddleware.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para obter o relatório de usuários cadastrados mensalmente
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/users-report
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.get(
  "/users-report",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // função para aguardar um determinado tempo (3 segundos)
      // const delay = (ms: number) =>
      //   new Promise((resolve) => setTimeout(resolve, ms));

      // await delay(3000);

      // Obter o repositório da entidade Situation
      const userRepository = AppDataSource.getRepository(User);

      const months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), 11 - i);
        return {
          key: format(date, "yyyy-MM"), // Chave no formato 2026-12
          label: format(date, "MMM", { locale: ptBR }).replace(".", ""), // Nome do mês abreviado
        };
      });

      // Buscar a quantidade de usuários cadastrados agrupados por mês e ano
      const result = await userRepository
        .createQueryBuilder("user")
        .select("DATE_FORMAT(user.createdAt, '%Y-%m')", "month")
        .addSelect("COUNT(user.id)", "users")

        // Filtra os registros para considerar apenas usuários criados a partir da data incial
        .where("user.createdAt >= :startDate", {
          startDate: months[0]!.key + "-01",
        }) // Primeiro dia do primeiro mês

        .groupBy("month") // Agrupa os registros pelo mês formatado (YYYY-MM)
        .orderBy("month", "ASC") // Ordena os resultados de forma crescente (ASC) pelo mês.
        .getRawMany(); // Executa a consulta e retorna os resultados como um array de objetos JavaScript.

      // Criar um mapa para os resultados
      const resultMap = new Map(
        result.map((r) => [r.month, parseInt(r.users, 10)]),
      );

      // Preencher os meses ausentes com o 0 usuários e substituir pelo nome abreviado
      const finalResult = months.map(({ key, label }) => ({
        month: label, // Nome do mês abreviado
        users: resultMap.get(key) || 0,
      }));

      // Retorna a resposta com os dados e informações da paginação
      res.status(200).json(finalResult);
      return;
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({
        message: "Erro ao gerar relatório de usuários!",
      });
      return;
    }
  },
);

// Criar a rota para obter o relatório de usuários cadastrados mensalmente
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/products-report
//  Enviar o Bearer Token do usupario logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.get(
  "/products-report",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // função para aguardar um determinado tempo (3 segundos)
      // const delay = (ms: number) =>
      //   new Promise((resolve) => setTimeout(resolve, ms));

      // await delay(3000);

      // Obter o repositório da entidade Situation
      const productRepository = AppDataSource.getRepository(Product);

      const months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), 11 - i);
        return {
          key: format(date, "yyyy-MM"), // Chave no formato 2026-12
          label: format(date, "MMM", { locale: ptBR }).replace(".", ""), // Nome do mês abreviado
        };
      });

      // Buscar a quantidade de produtos cadastrados agrupados por mês e ano
      const result = await productRepository
        .createQueryBuilder("product")
        .select("DATE_FORMAT(product.createdAt, '%Y-%m')", "month")
        .addSelect("COUNT(product.id)", "products")

        // Filtra os registros para considerar apenas usuários criados a partir da data incial
        .where("product.createdAt >= :startDate", {
          startDate: months[0]!.key + "-01",
        }) // Primeiro dia do primeiro mês

        .groupBy("month") // Agrupa os registros pelo mês formatado (YYYY-MM)
        .orderBy("month", "ASC") // Ordena os resultados de forma crescente (ASC) pelo mês.
        .getRawMany(); // Executa a consulta e retorna os resultados como um array de objetos JavaScript.

      // Criar um mapa para os resultados
      const resultMap = new Map(
        result.map((r) => [r.month, parseInt(r.products, 10)]),
      );

      // Preencher os meses ausentes com o 0 usuários e substituir pelo nome abreviado
      const finalResult = months.map(({ key, label }) => ({
        month: label, // Nome do mês abreviado
        products: resultMap.get(key) || 0,
      }));

      // Retorna a resposta com os dados e informações da paginação
      res.status(200).json(finalResult);
      return;
    } catch (error) {
      // Retornar erro em caso de falha
      //console.log(error);
      res.status(500).json({
        message: "Erro ao gerar relatório de produtos!",
      });
      return;
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
