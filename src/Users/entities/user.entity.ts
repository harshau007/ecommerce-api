import { CategoryEntity } from "src/categories/entities/category.entity";
import { Roles } from "src/utils/common/users-role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({unique: true})
    email: string

    @Column({select: false})
    password: string

    @Column({type:'enum', enum: Roles, array: true, default: [Roles.USER]})
    role: Roles[]

    @CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Timestamp

    @UpdateDateColumn({type: "timestamp with time zone", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Timestamp

    @OneToMany(()=>CategoryEntity, (cate)=> cate.addedBy)
    categories: CategoryEntity
}
