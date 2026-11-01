import {describe, beforeEach, expect, it, jest} from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengeStatus } from '../common/interfaces/challengeStatus.enum';

const makePlayerId = (value: string) => ({
  toString: () => value,
  equals: (candidate: any) => {
    if (typeof candidate === 'string') {
      return candidate === value;
    }

    if (candidate && typeof candidate.toString === 'function') {
      return candidate.toString() === value;
    }

    return false;
  },
});

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challengeModel: any;
  let matchModel: any;
  let categoryService: any;
  let playersService: any;

  beforeEach(() => {
    challengeModel = jest.fn(function (data: Record<string, any>) {
      const challenge = { ...data };
      challenge.save = jest.fn(async () => ({
        _id: 'challenge-1',
        ...challenge,
      }));
      return challenge;
    });
    challengeModel.findById = jest.fn();
    challengeModel.findOneAndUpdate = jest.fn();

    matchModel = jest.fn((data: Record<string, any>) => ({
      ...data,
      save: jest.fn(async () => ({ _id: 'match-1', ...data })),
    }));

    categoryService = {
      findPlayerCategory: jest.fn(),
    };

    playersService = {
      findAllPlayers: jest.fn(),
    };

    service = new ChallengesService(
      challengeModel,
      matchModel,
      categoryService,
      playersService
    );
  });

  it('should create a challenge for valid players and applicant', async () => {
    const playerId1 = makePlayerId('player-1');
    const playerId2 = makePlayerId('player-2');

    const player1 = {
      _id: playerId1,
      email: 'joao@email.com',
      name: 'João',
      phoneNumber: '11999999999',
    };
    const player2 = {
      _id: playerId2,
      email: 'ana@email.com',
      name: 'Ana',
      phoneNumber: '11999999998',
    };

    playersService.findAllPlayers.mockResolvedValue([player1, player2]);
    categoryService.findPlayerCategory.mockResolvedValue({ category: 'Categoria A' });

    const dto: any = {
      dateTimeChallenge: new Date('2025-02-01T10:00:00.000Z'),
      applicant: player1 as any,
      players: [player1 as any, player2 as any],
    };

    const result = await service.createChallenge(dto as any);

    expect(categoryService.findPlayerCategory).toHaveBeenCalledWith(dto.applicant);
    expect(result.category).toBe('Categoria A');
    expect(result.status).toBe(ChallengeStatus.PENDENTE);
  });

  it('should reject a challenge when applicant is not part of the players', async () => {
    const playerId1 = makePlayerId('player-1');
    const playerId2 = makePlayerId('player-2');

    const player1 = {
      _id: playerId1,
      email: 'joao@email.com',
      name: 'João',
      phoneNumber: '11999999999',
    };
    const player2 = {
      _id: playerId2,
      email: 'ana@email.com',
      name: 'Ana',
      phoneNumber: '11999999998',
    };

    playersService.findAllPlayers.mockResolvedValue([player1, player2]);
    categoryService.findPlayerCategory.mockResolvedValue({ category: 'Categoria A' });

    await expect(
      service.createChallenge({
        dateTimeChallenge: new Date('2025-02-01T10:00:00.000Z'),
        applicant: player1 as any,
        players: [player2 as any, player2 as any],
      } as any)
    ).rejects.toThrow(BadRequestException);
  });

  it('should link challenge to a valid match and mark it as realized', async () => {
    const playerId1 = makePlayerId('player-1');
    const playerId2 = makePlayerId('player-2');

    const player1 = {
      _id: playerId1,
      email: 'joao@email.com',
      name: 'João',
      phoneNumber: '11999999999',
    };
    const player2 = {
      _id: playerId2,
      email: 'ana@email.com',
      name: 'Ana',
      phoneNumber: '11999999998',
    };

    const challenge = {
      _id: 'challenge-1',
      category: 'Categoria A',
      players: [player1, player2],
      status: ChallengeStatus.PENDENTE,
      match: null,
    };

    challengeModel.findById.mockReturnValue({
      exec: jest.fn(async () => challenge),
    });

    await service.linkChallengeToMatch('challenge-1', {
      def: player1 as any,
      result: [{ set: '21-18' }],
    } as any);

    expect(matchModel).toHaveBeenCalledWith(
      expect.objectContaining({
        def: player1,
        result: [{ set: '21-18' }],
      })
    );
    expect(challengeModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'challenge-1' },
      { $set: expect.objectContaining({ status: ChallengeStatus.REALIZADO }) }
    );
  });
});
