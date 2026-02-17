import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Product } from "./Product.js";

@Entity("product_situations")
export class ProductSituation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Use strings ao invés de classes
  @OneToMany("Product", "product")
  products!: Product[];
}
