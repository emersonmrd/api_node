// Importar a conexão com banco de dados
import { DataSource } from "typeorm";
// Importar a entidade
import { User } from "../entity/User.js";
import { Situation } from "../entity/Situation.js";

export default class CreateUsersSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'users'...");

    // Obter o repositório da entidade User e Situation
    const userRepository = dataSource.getRepository(User);
    const situationRepository = dataSource.getRepository(Situation);

    // Verifica se já existem registros na tabela
    const existingCount = await userRepository.count();
    if (existingCount > 0) {
      console.log(
        "A tabela 'users' já possui dados. Nenhuma alteração foi realizada!",
      );
      return;
    }

    // Buscar a situação no banco de dados
    const situation = await situationRepository.findOne({ where: { id: 1 } });

    // Verificar se encontrou a situação no banco de dados
    if (!situation) {
      console.error(
        "Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'situations' está populada.",
      );
      return;
    }

    // Criar os usuários com a referência correta à situação
    const users = [
      {
        id: 1,
        name: "Cesar",
        email: "cesar@celke.com.br",
        password: "123456A#",
        situation: situation,
      },
      {
        id: 2,
        name: "Kelly",
        email: "kelly@celke.com.br",
        password: "123456A#",
        situation: situation,
      },
      {
        id: 3,
        name: "Jessica",
        email: "jessica@celke.com.br",
        password: "123456A#",
        situation: situation,
      },
      {
        id: 4,
        name: "Gabrielly",
        email: "gabrielly@celke.com.br",
        password: "123456A#",
        situation: situation,
      },
    ];

    // Salvar os registros no banco de dados.
    await userRepository.save(users);

    console.log("Seed concluído com sucesso: usuarios cadastrados!");
  }
}
