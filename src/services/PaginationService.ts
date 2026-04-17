import { FindOptionsOrder, ObjectLiteral, Repository } from "typeorm";

// Definir uma interface para o resultado da paginação, que será genérica e adptável a qualquer tipo de entidade
interface PaginationResult<T> {
  error: boolean;
  data: T[];
  currentPage: number;
  lastPage: number;
  totalRecords: number;
}

// Define uma classe de serviço para implementar a lo´gica de paginação
export class PaginationService {
  // Método estático que realiza a paginação em qualquer repositório genérico
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    order: FindOptionsOrder<T> = {},
  ): Promise<PaginationResult<T>> {
    // Conta o total de registros no repositório para determinar a quantidade total de páginas
    const totalRecords = await repository.count();

    // Calcular o número da última página baseado no total de registros e no limite de registros por página
    const lastPage = Math.ceil(totalRecords / limit);

    // Verificar se a página solicitada é válida; se não for, lança um erro
    if (page > lastPage && lastPage > 0) {
      throw new Error(`Página inválida. Total de páginas ${lastPage}`);
    }

    // Calcula o "offset", que é o índice do primeiro registro que deve ser retornado na página atual
    const offset = (page - 1) * limit;

    // Busca os registros do repositório com base no limite, offset e ordem de classificação
    const data = await repository.find({
      take: limit,
      skip: offset,
      order,
    });

    // Retorna o resultado da paginação em um formato estruturado
    return {
      error: false,
      data,
      currentPage: page,
      lastPage,
      totalRecords,
    };
  }
}
