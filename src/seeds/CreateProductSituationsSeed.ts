import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituation.js";

export default class CreateProductSituationsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'product_situations'...");

    // Obter o repositório da entidade 'ProductSituation'
    const productSituationRepository =
      dataSource.getRepository(ProductSituation);

    // Verifica se já existem registros na tabela
    const existingCount = await productSituationRepository.count();
    if (existingCount > 0) {
      console.log(
        "A tabela 'product_situations' já possui dados. Nenhuma alteração foi realizada!",
      );
      return;
    }

    // Criar as situações produto que devem ser cadastradas no banco de dados
    const productSituations = [
      { name: "Disponível" },
      { name: "Alugado" },
      { name: "Reservado" },
    ];

    // Salvar os registros no banco de dados.
    await productSituationRepository.save(productSituations);

    console.log("Seed concluído com sucesso: situações produtos cadastradas!");
  }
}
