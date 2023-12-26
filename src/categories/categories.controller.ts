import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthRequest } from 'src/auth/types/authRequest.type';
import { AuthGuard } from 'src/auth/guards/authentication.gaurd';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role } from 'src/decorator/role.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Role(['admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: AuthRequest) {
    return await this.categoriesService.create(createCategoryDto, req);
  }

  @Role(['user','admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Role(['admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(+id);
  }

  @Role(['admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesService.update(+id, updateCategoryDto);
    return { "message": "Category Updated" }
  }

  @Role(['admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
