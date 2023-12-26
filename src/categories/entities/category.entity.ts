import { UserEntity } from "src/Users/entities/user.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string 

    @Column()
    description: string

    @CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP", })
    createdAt: Timestamp

    @UpdateDateColumn({type: "timestamp with time zone", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Timestamp

    @ManyToOne(()=> UserEntity, (user)=> user.categories)
    addedBy: UserEntity

    @OneToMany(()=> ProductEntity, (product)=> product.belongsTo)
    products: ProductEntity[]
}
