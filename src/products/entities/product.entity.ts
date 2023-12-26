import { UserEntity } from "src/Users/entities/user.entity";
import { CategoryEntity } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
    price: number

    @Column()
    quantity: number

    @Column('simple-array')
    images: string[]

    @CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Timestamp

    @UpdateDateColumn({type: "timestamp with time zone", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Timestamp

    @ManyToOne(()=> UserEntity, (user)=> user.products)
    createdBy: UserEntity

    @ManyToOne(()=> CategoryEntity, (cate)=> cate.products)
    belongsTo: CategoryEntity
}