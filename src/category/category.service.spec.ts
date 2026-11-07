import { describe, beforeEach, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModel: any;
  let playersService: any;

  beforeEach(() => {
    categoryModel = jest.fn((data: Record<string, unknown>) => ({
      ...data,
      save: jest.fn(async () => ({ _id: 'category-1', ...data })),
    }));
    categoryModel.findOne = jest.fn();
    categoryModel.findOneAndUpdate = jest.fn();

    playersService = {
      findAllPlayers: jest.fn(),
    };

    service = new CategoryService(categoryModel, playersService);
  });

  it('should create a category when it does not exist', async () => {
    categoryModel.findOne.mockReturnValue({
      exec: jest.fn(async () => null),
    });

    const dto = {
      category: 'Categoria A',
      description: 'Descrição da categoria',
      events: [{ name: 'Ranking', operation: 'sum', value: 10 }],
    };

    const result = await service.createCategory(dto);

    expect(categoryModel.findOne).toHaveBeenCalledWith({
      category: dto.category,
    });
    expect(result).toEqual(
      expect.objectContaining({
        category: dto.category,
        description: dto.description,
      })
    );
  });

  it('should reject duplicate category creation', async () => {
    categoryModel.findOne.mockReturnValue({
      exec: jest.fn(async () => ({ category: 'Categoria A' })),
    });

    await expect(
      service.createCategory({
        category: 'Categoria A',
        description: 'Descrição da categoria',
        events: [{ name: 'Ranking', operation: 'sum', value: 10 }],
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('should link a player to an existing category', async () => {
    const category = {
      _id: 'category-1',
      category: 'Categoria A',
      description: 'Descrição da categoria',
      events: [{ name: 'Ranking', operation: 'sum', value: 10 }],
      players: ['player-1'],
    };

    let callIndex = 0;
    categoryModel.findOne.mockImplementation(() => {
      callIndex += 1;

      if (callIndex === 1) {
        return {
          exec: jest.fn(async () => category),
        };
      }

      return {
        where: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        exec: jest.fn(async () => null),
      };
    });

    playersService.findAllPlayers.mockResolvedValue([
      {
        _id: 'player-2',
        email: 'novo@email.com',
        name: 'Novo',
        phoneNumber: '11999999999',
      },
    ]);

    await service.linkCategoryToPlayer({
      category: 'Categoria A',
      playerId: 'player-2',
    } as any);

    expect(categoryModel.findOneAndUpdate).toHaveBeenCalledWith(
      { category: 'Categoria A' },
      { $set: expect.objectContaining({ players: ['player-1', 'player-2'] }) }
    );
  });
});
