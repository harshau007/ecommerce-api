import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthRequest } from 'src/auth/types/authRequest.type';
import { Role } from 'src/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.gaurd';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Role(['admin'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Req() req: AuthRequest) {
    return await this.productsService.create(createProductDto, req);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
