import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

// Importando a entidade Situation
import { Situation } from "./Situation.js";

// Importar a biblioteca para criptografar a senha
import bcrypt from "bcryptjs";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "varchar", unique: true })
  recoverPassword!: string;

  // Relacionamento ManyToOne com a tabela situations
  @ManyToOne(() => Situation, (situation) => situation.users)
  @JoinColumn({ name: "situationId" }) // Nome da chave estrangeira
  situation!: any; // evita metadata circular

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @BeforeInsert() // Executa o método antes de inserir um novo usuário
  @BeforeUpdate() // Executa o método antes de atualizar um usuário existente
  async hashPassword(): Promise<void> {
    // Verificar se a senha está definida e a criptografa antes de salvar no banco.
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // Método para comparar a senha informada pelo usuário com a senha armazenada no banco de dados.
  async comparePassword(password: string): Promise<boolean> {
    // Compara senha enviada pela requisição com a senha criptografada no banco de dados
    return bcrypt.compare(password, this.password);
  }
}
