import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { DatabaseModule } from './../database/database.module';
import { PlayerProvider } from './players.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayersController],
  providers: [PlayersService, ...PlayerProvider],
  exports: [PlayersService],
})
export class PlayersModule {}
