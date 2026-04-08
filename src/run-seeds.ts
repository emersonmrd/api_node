import { AppDataSource } from "./data-source.js";
import CreateProductCategoriesSeed from "./seeds/CreateProductCategoriesSeed.js";
import CreateProductSituationsSeed from "./seeds/CreateProductSituationsSeed.js";
import CreateSituationsSeed from "./seeds/CreateSituationsSeed.js";
import CreateUsersSeed from "./seeds/CreateUsersSeed.js";

const runSeeds = async () => {
  console.log("Conectando ao banco de dados...");

  // Inicializa a conexão com o banco de dados
  await AppDataSource.initialize();

  console.log("Banco de dados conectado.");

  try {
    // Criar uma instância das classes de seed
    const situationsSeed = new CreateSituationsSeed();
    const usersSeed = new CreateUsersSeed();
    const productSituationsSeed = new CreateProductSituationsSeed();
    const productCategoriesSeed = new CreateProductCategoriesSeed();

    // Executar as seeds
    await situationsSeed.run(AppDataSource);
    await usersSeed.run(AppDataSource);
    await productSituationsSeed.run(AppDataSource);
    await productCategoriesSeed.run(AppDataSource);
  } catch (error) {
    console.error("Erro ao executar o seed: ", error);
  } finally {
    // Fecha a conexão com o banco de dados.
    await AppDataSource.destroy();
    console.log("Conexão com banco de dados encerrada.");
  }
};
runSeeds();
