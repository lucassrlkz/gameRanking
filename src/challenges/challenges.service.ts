import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dtos/createChallenge.dto';
import { UpdateChallengeDto } from './dtos/updateChallenge.dto';
import { CategoryService } from 'src/category/category.service';
import { PlayersService } from 'src/players/players.service';
import { Challenge, Match } from 'src/common/interfaces/challenge.interface';
import {
  notExist,
  notFound,
  objectLengthIsZero,
} from 'src/common/errors/errorHandle';
import { ChallengeStatus } from 'src/common/interfaces/challengeStatus.enum';
import { LinkChallengeToMatchDto } from './dtos/linkChallengeToMatch.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject('CHALLENGE_MODEL')
    private readonly challengeModel: Model<Challenge>,
    @Inject('MATCH_MODEL') private readonly matchModel: Model<Match>,
    private categoryService: CategoryService,
    private playersService: PlayersService
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    const players = await this.playersService.findAllPlayers();

    /**
     * Verifica se os jogadores informados estão cadastrados
     */
    createChallengeDto.players.map(async (playerDto) => {
      const playerfilter = players.filter(
        (player) => player._id == playerDto._id
      );

      objectLengthIsZero(
        playerfilter,
        `O id ${playerDto._id} não é um jogador`
      );
    });

    /**
     * Verifica se o solicitante é um dos jogadores da partida
     */
    const applicantPlayerMatch = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.applicant
    );

    this.logger.log(`applicantPlayerMatch: ${applicantPlayerMatch}`);

    objectLengthIsZero(
      applicantPlayerMatch,
      `O solicitante deve ser um jogador da partida`
    );

    /**
     * Descobrimos a categoria com base no ID do jogador solicitante
     */
    const playerCategory = await this.categoryService.findPlayerCategory(
      createChallengeDto.applicant
    );

    notExist(
      playerCategory,
      `O solicitante precisa estar registrado em uma categoria!`
    );

    const createdChallenge = new this.challengeModel(createChallengeDto);

    createdChallenge.category = playerCategory.category;
    createdChallenge.dateTimeRequest = new Date();
    createdChallenge.status = ChallengeStatus.PENDENTE;

    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);

    return await createdChallenge.save();
  }

  async findAllChallenges(): Promise<Array<Challenge>> {
    const challenge = await this.challengeModel
      .find()
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    return challenge;
  }

  async findChallengeOfPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.findAllPlayers();

    const playerFilter = players.filter((player) => player._id == _id);

    objectLengthIsZero(playerFilter, `O id ${_id} não é um jogador`);

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    notFound(challengeFound, `Desafio ${_id} não cadastrado`);

    if (updateChallengeDto.status) {
      challengeFound.dateTimeResponse = new Date();
    }

    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: challengeFound }
    );
  }

  async linkChallengeToMatch(
    _id: string,
    linkChallengeMatchDto: LinkChallengeToMatchDto
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    notExist(challengeFound, `Desafio ${_id} não encontrado`);

    /**
     * Verifica se o jogador vencedor faz parte do desafio
     */
    const playerFilter = challengeFound.players.filter(
      (player) => player._id == linkChallengeMatchDto.def
    );

    this.logger.log(`challengeFound: ${challengeFound}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    objectLengthIsZero(
      playerFilter,
      `O jogador vencedor não faz parte do desafio`
    );

    /**
     * criar e persistir o objjeto de partida
     */
    const createdMatch = new this.matchModel(linkChallengeMatchDto);
    /**
     * atribuir ao objeto partida a categoria e os jogadores do desafio
     */
    createdMatch.category = challengeFound.category;

    createdMatch.players = challengeFound.players;

    const result = await createdMatch.save();

    challengeFound.status = ChallengeStatus.REALIZADO;

    challengeFound.match = result;

    try {
      await this.challengeModel.findOneAndUpdate(
        { _id },
        { $set: challengeFound }
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id });

      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    notExist(challengeFound, `Desafio ${_id} não cadastrado`);

    challengeFound.status = ChallengeStatus.CANCELADO;

    await this.challengeModel.findByIdAndUpdate(
      { _id },
      { $set: challengeFound }
    );
  }
}
