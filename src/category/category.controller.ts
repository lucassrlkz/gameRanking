import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { Category } from '../common/interfaces/category.interface';
import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/v1/categorias')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Put('/:categoryId')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('categoryId') _id: string
  ): Promise<void> {
    await this.categoriesService.updateCategory(_id, updateCategoryDto);
  }

  @Get()
  async findAllCategories(): Promise<Array<Category>> {
    return await this.categoriesService.findAllCategories();
  }

  @Get('/:categoryId')
  async findCategoryById(@Param('categoryId') _id: string): Promise<Category> {
    return await this.categoriesService.findCategoryById(_id);
  }

  @Post('/:category/jogadores/:playerId')
  async linkCategoryToPlayer(@Param() params: Array<string>): Promise<void> {
    await this.categoriesService.linkCategoryToPlayer(params);
  }
}
