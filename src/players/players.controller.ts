import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from '../common/interfaces/player.interface';
import { PlayersService } from './players.service';
import { ValidationParamsPipe } from '../common/pipes/validation-params.pipe';
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/v1/jogadores')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePLayerDto: UpdatePlayerDto,
    @Param('_id', ValidationParamsPipe) _id: string
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePLayerDto);
  }

  @Get()
  async findAllPlayers(): Promise<Player[]> {
    return await this.playersService.findAllPlayers();
  }

  @Get('/:_id')
  async findPlayerById(
    @Param('_id', ValidationParamsPipe) _id: string
  ): Promise<Player> {
    return await this.playersService.findPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationParamsPipe) _id: string
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
