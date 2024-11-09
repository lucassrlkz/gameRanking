import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/createChallenge.dto';
import { UpdateChallengeDto } from './dtos/updateChallenge.dto';
import { Challenge } from 'src/common/interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from 'src/common/pipes/challenge-status-validation-params.pipe';
import { LinkChallengeToMatchDto } from './dtos/linkChallengeToMatch.dto';

@Controller('api/v1/desafios')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`
    );
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async findAllChallenges(
    @Query(':PlayerId') playerId: string
  ): Promise<Array<Challenge>> {
    return playerId
      ? await this.challengesService.findChallengeOfPlayer(playerId)
      : await this.challengesService.findAllChallenges();
  }

  @Put(':challengeId')
  updateChallenge(
    @Param('challengeId') _id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto
  ) {
    return this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post(':challengeId/partida')
  linkChallengeToMatch(
    @Body(ValidationPipe) linkChallengeToMatchDto: LinkChallengeToMatchDto,
    @Param('challengeId') _id: string
  ): Promise<void> {
    return this.challengesService.linkChallengeToMatch(
      _id,
      linkChallengeToMatchDto
    );
  }

  @Delete(':id')
  deleteChallenge(@Param('id') _id: string) {
    return this.challengesService.deleteChallenge(_id);
  }
}
