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
// Importar a biblioteca para enviar e-mail
import nodemailer from "nodemailer";
// Importar a biblioteca variáveis de ambiente
import "dotenv/config";

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
  "urlRecoverPassword": "http://localhost:8080",
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

      // Criar a variável com as credencias do servidor para enviar e-mail
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Variável para montar o link de recuperação de senha.
      var recover_passwd_link = `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`;

      // Criar a variável com o conteúdo do e-mail
      var message_content = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: "Recuperar senha",
        text: `Prezado(a) ${user.name}\n\nInformamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\nClique ou copie o link para criar uma nova senha em nosso sistema: ${recover_passwd_link}\n\nEsta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\nVocê está recebendo este e-mail porque está cadastrado no banco de dados da empresa ${process.env.APP}. Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n`, // Conteúdo do e-mail somente texto
        html: `Prezado(a) ${user.name}<br><br>Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>Clique no link para criar uma nova senha em nosso sistema: <a href=${recover_passwd_link}>${recover_passwd_link}</a><br><br>Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>Você está recebendo este e-mail porque está cadastrado no banco de dados da empresa ${process.env.APP}. Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>`, // Conteúdo do e-mail com HTML
      };

      // Enviar e-mail
      transporter.sendMail(message_content, function (err) {
        if (err) {
          console.log(`Erro ao enviar e-mail:\n\n${err}`);
          // Retornar a resposta de erro
          res.status(200).json({
            message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`,
          });
          return;
        } else {
          // Retornar a resposta de sucesso
          res.status(200).json({
            message: "E-mail enviado! Verifique sua caixa de entrada.",
            urlRecoverPassword: recover_passwd_link,
          });
          return;
        }
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
        message: "Erro ao recuperar a senha!",
      });
    }
  },
);

// Criar a rota para validar a chave recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST:http://localhost:8080/validate-recover-password
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "recoverPassword": "chave-recuperar-senha",
  "email": "cesar@celke.com.br"
}
*/

router.post(
  "/validate-recover-password",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Receber os dados enviados no corpo da requisição
      var data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        recoverPassword: yup.string().required("A chave é obrigatória!"),
        email: yup
          .string()
          .email("E-mail inválido!")
          .required("O campo e-mail é obrigatório!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Obter o repositório da entidade User
      const userRepository = AppDataSource.getRepository(User);

      // Buscar o usuário no banco de dados pelo email e recoverPassword
      const user = await userRepository.findOneBy({
        email: data.email,
        recoverPassword: data.recoverPassword,
      });

      // Verificar se o usuário foi encontrado
      if (!user) {
        res.status(404).json({ message: "Chave recuperar senha inválida!" });
        return;
      }

      // Retornar a resposta de sucesso
      res.status(200).json({
        message: "Chave recuperar senha válida!",
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
        message: "Chave recuperar senha inválida!",
      });
    }
  },
);

// Exportar a instrução que está dentro da constante router
export default router;
