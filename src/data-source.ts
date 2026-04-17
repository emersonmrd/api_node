import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product.js";
import { ProductCategory } from "./entity/ProductCategory.js";
import { ProductSituation } from "./entity/ProductSituation.js";
import { Situation } from "./entity/Situation.js";
import { User } from "./entity/User.js";

// Importar a biblioteca variáveis de ambiente
import "dotenv/config";

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
  type: dialect as "mysql",
  //type: dialect as "mysql" | "mariadb" | "postgres" | "oracle" | "mongodb",
  host: process.env.DB_HOST as string,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  synchronize: false,
  logging: true,
  entities: [Situation, User, Product, ProductCategory, ProductSituation],
  subscribers: [],
  migrations: ["./dist/migration/*.js"],
});

// Inicializar a conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com suecesso!.");
  })
  .catch((error) => {
    console.log("Erro na conexão com o banco de dados:", error);
  });
