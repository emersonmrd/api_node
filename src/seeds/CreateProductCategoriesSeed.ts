import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategory.js";

export default class CreateProductCategoriesSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'product_categories'...");

    // Obter o repositório da entidade 'ProductCategory'
    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    // Verifica se já existem registros na tabela
    const existingCount = await productCategoryRepository.count();
    if (existingCount > 0) {
      console.log(
        "A tabela 'product_categories' já possui dados. Nenhuma alteração foi realizada!",
      );
      return;
    }

    // Criar as categorias do produto que devem ser cadastradas no banco de dados
    const productCategories = [
      { name: "Casa" },
      { name: "Chácara" },
      { name: "Galpão" },
      { name: "Carro" },
      { name: "Loja" },
      { name: "Apartamento" },
    ];

    // Salvar os registros no banco de dados.
    await productCategoryRepository.save(productCategories);

    console.log(
      "Seed concluído com sucesso: categorias dos produtos cadastradas!",
    );
  }
}
