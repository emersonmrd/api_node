import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// Import da entidade User
import { User } from "./User";

@Entity()
export class Situation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nameSituation!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Relacionamento OneToMany com a tabela users
  @OneToMany(() => User, (user) => user.situation)
  users!: User[];
}
