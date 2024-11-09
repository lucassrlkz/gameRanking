import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Category } from '../common/interfaces/category.interface';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { PlayersService } from 'src/players/players.service';
import {
  notExist,
  isExist,
  objectLengthIsZero,
  notFound,
} from '../common/errors/errorHandle';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_MODEL') private categoryModel: Model<Category>,
    private readonly playersService: PlayersService
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    isExist(categoryFound, `Categoria ${category} já cadastrada `);

    const createCategory = new this.categoryModel(createCategoryDto);
    return createCategory.save();
  }

  async updateCategory(
    _id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<void> {
    const categoryFound = await this.categoryModel.findOne({ _id });

    notFound(categoryFound, 'Categoria não encontrada');

    await this.categoryModel.findOneAndUpdate(
      { _id },
      { $set: updateCategoryDto }
    );
  }

  async findAllCategories(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findCategoryById(_id: string): Promise<Category> {
    const categoryFound = await this.categoryModel.findOne({ _id }).exec();

    notFound(categoryFound, 'Categoria não encontrada');
    return categoryFound;
  }

  async linkCategoryToPlayer(params: Array<string>): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    const playerAlreadyLinked = await this.categoryModel
      .findOne({ category })
      .where('players')
      .in(playerId)
      .exec();

    const players = await this.playersService.findAllPlayers();
    const playerFilter = players.filter((player) => player._id == playerId);

    objectLengthIsZero(playerFilter, `O id ${playerId} não é um jogador`);

    notExist(categoryFound, `Categoria ${category} não cadastrada`);

    isExist(
      playerAlreadyLinked,
      `Jogador ${playerId} já cadastrado na categoria ${playerAlreadyLinked.category}`
    );

    categoryFound.players.push(playerId);

    await this.categoryModel.findOneAndUpdate(
      { category },
      { $set: categoryFound }
    );
  }

  async findPlayerCategory(playerId: any): Promise<Category> {
    const players = await this.playersService.findAllPlayers();

    const playerFilter = players.filter((player) => player._id == playerId);

    objectLengthIsZero(playerFilter, `O id ${playerId} não é um jogador`);

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }
}
