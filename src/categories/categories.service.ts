import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/Users/users.service';
import { AuthRequest } from 'src/auth/types/authRequest.type';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepo: Repository<CategoryEntity>, private readonly userService: UsersService, private readonly dataSource: DataSource) {}

  async create(createCategoryDto: CreateCategoryDto, req: AuthRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = this.categoryRepo.create(createCategoryDto);
      const user = await this.userService.currentUser(req);
      category.addedBy = user;
      
      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return { category }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error occured while creating category');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: {
        id: id
      },
      select: {
        id: true,
        title: true,
        description: true,
        addedBy: {
          id:true,
          name:true,
          email:true
        }
      },
      relations: {
        addedBy: true
      }
    });
    if (!category) throw new BadRequestException("Category does not exits");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryRepo.update(
        { id },
        {
          title: updateCategoryDto.title,
          description: updateCategoryDto.description,
          updatedAt: new Date(),
        }
      );

      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return { "updated": category };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error occured while updating');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepo.delete({id});
    return category;
  }
}
