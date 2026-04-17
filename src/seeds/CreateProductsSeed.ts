// Importar a conexão com banco de dados
import { DataSource } from "typeorm";
// Importar a entidade
import { Product } from "../entity/Product.js";
import { ProductSituation } from "../entity/ProductSituation.js";
import { ProductCategory } from "../entity/ProductCategory.js";

export default class CreateProductsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'products'...");

    // Obter o repositório da entidade Product e ProductSituation
    const productRepository = dataSource.getRepository(Product);
    const productSituationRepository =
      dataSource.getRepository(ProductSituation);
    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    // Verifica se já existem registros na tabela
    const existingCount = await productRepository.count();
    if (existingCount > 0) {
      console.log(
        "A tabela 'products' já possui dados. Nenhuma alteração foi realizada!",
      );
      return;
    }

    // Buscar a situação no banco de dados
    const situation = await productSituationRepository.findOne({
      where: { id: 1 },
    });

    // Verificar se encontrou a situação no banco de dados
    if (!situation) {
      console.error(
        "Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'product_situations' está populada.",
      );
      return;
    }

    // Buscar a categoria no banco de dados
    const category = await productCategoryRepository.findOne({
      where: { id: 1 },
    });

    // Verificar se encontrou a categoria no banco de dados
    if (!category) {
      console.error(
        "Erro: Nenhuma categoria encontrada com ID 1. Verifique se a tabela 'product_categories' está populada.",
      );
      return;
    }

    // Criar os produtos com a referência correta à situação
    // Criar os produtos como instâncias da entidade Product
    const products = [
      Object.assign(new Product(), {
        id: 1,
        name: "Curso de Node.js",
        slug: "curso-de-nodejs",
        description: "No Curso de Node.js é abordado o desenvolvimento ...",
        price: 447.87,
        situation: situation,
        category: category,
      }),
      Object.assign(new Product(), {
        id: 2,
        name: "Curso de React",
        slug: "curso-de-react",
        price: 467.57,
        description: "No Curso de React é abordado o desenvolvimento ...",
        situation: situation,
        category: category,
      }),
      Object.assign(new Product(), {
        id: 3,
        name: "Curso de Node.js e React",
        slug: "curso-de-nodejs-e-react",
        price: 497.67,
        description:
          "No Curso de Node.js e React é abordado o desenvolvimento ...",
        situation: situation,
        category: category,
      }),
    ];

    // Salvar os registros no banco de dados.
    await productRepository.save(products);

    console.log("Seed concluído com sucesso: usuarios cadastrados!");
  }
}
