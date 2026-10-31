import { validate } from 'class-validator';
import { CreatePlayerDto } from '../players/dtos/createPlayer.dto';
import { CreateCategoryDto } from '../category/dtos/createCategory.dto';
import { CreateChallengeDto } from '../challenges/dtos/createChallenge.dto';

describe('DTO validation', () => {
  it('should reject invalid player payload', async () => {
    const dto = Object.assign(new CreatePlayerDto(), {
      email: 'not-an-email',
      name: '',
      phoneNumber: '',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid category payload', async () => {
    const dto = Object.assign(new CreateCategoryDto(), {
      category: '',
      description: '',
      events: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid challenge payload', async () => {
    const dto = Object.assign(new CreateChallengeDto(), {
      dateTimeChallenge: 'invalid-date',
      applicant: null,
      players: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
