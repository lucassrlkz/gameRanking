import { Injectable, Inject } from '@nestjs/common';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from '../common/interfaces/player.interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { isExist, notFound } from '../common/errors/errorHandle';

@Injectable()
export class PlayersService {
  constructor(
    @Inject('PLAYER_MODEL') private readonly playerModel: Model<Player>
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    isExist(playerFound, `Jogador com o email ${email} já cadastrado`);

    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto
  ): Promise<void> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    notFound(playerFound, `jogador com o id: ${_id} não encontrado`);

    await this.playerModel.findOneAndUpdate({ _id }, { $set: updatePlayerDto });
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerById(_id: string): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    notFound(playerFound, `Jogador com id ${_id} não encontrado`);

    return playerFound;
  }

  async deletePlayer(_id: string): Promise<any> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    notFound(playerFound, `jogador com o id: ${_id} não encontrado`);

    return await this.playerModel.deleteOne({ _id });
  }
}
