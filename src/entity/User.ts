import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Situation } from "./Situation";
// Import da entidade Situation

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  // Relacionamento ManyToOne com a tabela situations
  @ManyToOne(() => Situation, (situation) => situation.users)
  @JoinColumn({ name: "situationId" }) // Nome da chave estrangeira
  situation!: Situation;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
