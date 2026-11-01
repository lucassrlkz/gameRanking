import{ describe, beforeEach, expect, jest, it} from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerModel: any;

  beforeEach(() => {
    playerModel = jest.fn((data: Record<string, any>) => ({
      ...data,
      save: jest.fn(async () => ({ _id: 'player-1', ...data })),
    }));
    playerModel.findOne = jest.fn();

    service = new PlayersService(playerModel);
  });

  it('should create a player when email is not registered', async () => {
    playerModel.findOne.mockReturnValue({
      exec: jest.fn(async () => null),
    });

    const dto = {
      email: 'joao@email.com',
      name: 'João',
      phoneNumber: '11999999999',
    };

    const result = await service.createPlayer(dto);

    expect(playerModel.findOne).toHaveBeenCalledWith({ email: dto.email });
    expect(result).toEqual(
      expect.objectContaining({
        email: dto.email,
        name: dto.name,
      })
    );
  });

  it('should reject duplicate email registration', async () => {
    playerModel.findOne.mockReturnValue({
      exec: jest.fn(async () => ({ email: 'joao@email.com' })),
    });

    await expect(
      service.createPlayer({
        email: 'joao@email.com',
        name: 'João',
        phoneNumber: '11999999999',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('should find a player by id', async () => {
    const player = {
      _id: 'player-1',
      email: 'joao@email.com',
      name: 'João',
      phoneNumber: '11999999999',
    };

    playerModel.findOne.mockReturnValue({
      exec: jest.fn(async () => player),
    });

    await expect(service.findPlayerById('player-1')).resolves.toEqual(player);
  });

  it('should throw when searching for an inexistent player', async () => {
    playerModel.findOne.mockReturnValue({
      exec: jest.fn(async () => null),
    });

    await expect(service.findPlayerById('player-404')).rejects.toThrow(
      NotFoundException
    );
  });
});
