// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar o serviço de autenticação, responsável por validar o login do usuário
import { AuthService } from "../services/AuthService.js";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para realizar o login
// Endereço para acessar a api através da aplicação externa com o verbo POST:http://localhost:8080/
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "email": "cesar@celke.com.br",
  "password": "123456A#"
}
*/
router.post("/", async (req: Request, res: Response) => {
  try {
    // Extrair `email` e `password` do corpo da requisição
    const { email, password } = req.body;

    // Verificar se `email` e `password` foram fornecidos
    if (!email || !password) {
      res.status(400).json({
        message: "E-mail e senha são obrigatórios!",
      });
      return;
    }

    // Criar uma instância do serviço de autenticação
    const authService = new AuthService();

    // Chamar o método `login` para validar as credenciais e obter os do usuário
    const userData = await authService.login(email, password);

    //Retornar a resposta de sucesso com os dados do usuário autenticado
    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: userData,
    });
    // Finaliza a execução do bloco `try`
    return;
  } catch (error: any) {
    // Retornar erro em caso de falha
    res
      .status(401)
      .json({ message: error.message || "Erro ao realizar o login!" });
    return;
  }
});

// Exportar a instrução que está dentro da constante router
export default router;
