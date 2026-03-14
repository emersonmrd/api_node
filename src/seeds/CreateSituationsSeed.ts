import { DataSource } from "typeorm";
import { Situation } from "../entity/Situation.js";

export default class CreateSituationsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'situations'...");

    // Obter o repositório da entidade 'Situation'
    const situationRepository = dataSource.getRepository(Situation);

    // Verifica se já existem registros na tabela
    const existingCount = await situationRepository.count();
    if (existingCount > 0) {
      console.log(
        "A tabela 'situation' já possui dados. Nenhuma alteração foi realizada!",
      );
      return;
    }

    // Criar as situações que devem ser cadastradas no banco de dados
    const situations = [
      { nameSituation: "Ativo" },
      { nameSituation: "Inativo" },
      { nameSituation: "Pendente" },
    ];

    // Salvar os registros no banco de dados.
    await situationRepository.save(situations);

    console.log("Seed concluído com sucesso: situações cadastradas!");
  }
}
