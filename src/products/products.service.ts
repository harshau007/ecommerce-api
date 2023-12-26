import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/Users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { AuthRequest } from 'src/auth/types/authRequest.type';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>, private readonly userService: UsersService, private readonly categoryService: CategoriesService, private readonly dataSource: DataSource) {}

  async create(createProductDto: CreateProductDto, req: AuthRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryService.findOne(+createProductDto.belongsAt);
      const user = await this.userService.currentUser(req);
      const product = this.productRepo.create(createProductDto);
      product.createdBy = user;
      product.belongsTo = category;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return { product };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error occured while registering');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.productRepo.find({
      relations: {
        createdBy: true,
        belongsTo: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        images: true,
        quantity: true,
        createdBy: {
          id: true
        },
        belongsTo: {
          id: true
        }
      }
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        createdBy: true,
        belongsTo: true
      },
    });
    if (!product) throw new BadRequestException("Product does not exist");
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productRepo.update(
        { id },
        {
          title: updateProductDto.title,
          description: updateProductDto.description,
          price: updateProductDto.price,
          images: updateProductDto.images,
          quantity: updateProductDto.quantity,
          updatedAt: new Date()
        }
      )
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return { "updated": product };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error occured while registering');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id)  
    await this.productRepo.delete(id);
    return { "deleted": product }
  }
}
