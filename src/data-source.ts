import "reflect-metadata";
import { DataSource } from "typeorm";

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
  entities: [],
  subscribers: [],
  migrations: [],
});
