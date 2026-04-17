// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";
// Improtar a entidade situation
import { User } from "../entity/User.js";
// Importar a biblioteca para validar os dados para cadastrar e editar.
import * as yup from "yup";
// Importar a biblioteca para gerar a chave recuperar senha
import crypto from "crypto";
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

// Criar a rota para recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST:http://localhost:8080/recover-password
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "urlRecoverPassword": "http://localhost",
  "email": "cesar@celke.com.br"
}
*/

router.post(
  "/recover-password",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Receber os dados enviados no corpo da requisição
      var data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        urlRecoverPassword: yup.string().required("A URL é óbrigatória!"),
        email: yup
          .string()
          .email("E-mail inválido!")
          .required("O campo e-mail é obrigatório!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      // Buscar o usuário no banco de dados pelo email
      const user = await userRepository.findOneBy({
        email: data.email,
      });

      // Verificar se o usuário foi encontrado
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      // Gera um token seguro de 64 caracteres
      user.recoverPassword = crypto.randomBytes(32).toString("hex");

      // Salvar as alterações no banco de dados
      await userRepository.save(user);

      // Retornar a resposta de sucesso
      res.status(200).json({
        message: "Gerado o link para recuperar a senha!",
        urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
        key: user.recoverPassword,
      });
      return;
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
        message: "Erro ao recuperar a senha!",
      });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
