// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source.js";

// Improtar a entidade situation
import { User } from "../entity/User.js";

// Importar a biblioteca variáveis de ambiente
import "dotenv/config";

// Manipular token de aunteticação
import jwt from "jsonwebtoken";

// Classe responsável pela autenticação do usuário
export class AuthService {
  // Criar um repositório para manipular a tabela `User` no banco de dados
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Método para autenticar um usuário com e-mail e senha
   * @param email - E-mail do usuário
   * @param password - Senha do usuário
   * @returns Dados do usuário autenticado e token de acesso
   * @throws Erro caso as credenciais sejam inválidas
   */

  async login(
    email: string,
    password: string,
  ): Promise<{ id: number; name: string; email: string; token: string }> {
    // Buscar o usuário no banco dados pelo e-mail informado
    const user = await this.userRepository.findOne({ where: { email: email } });

    // Se o usuário não for encontrado, lançar um erro
    if (!user) {
      throw new Error("Usuário ou senha inválidos!");
    }
    // Verificar se a senha informada corresponde à senha armazenada no banco
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Usuário ou senha inválidos!");
    }

    // Gerar um token JWT para o usuário autenticado
    // O token inclui o ID do usuário e expira em 7 dias
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // Retornar os dados do usuário autenticado junto com o token gerado
    return { id: user.id, name: user.name, email: user.email, token };
  }
}
