import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PlayersModule } from 'src/players/players.module';
import { CategoryModule } from 'src/category/category.module';
import { ChallengesProvider } from './challenges.provider';
import { MatchsProvider } from './match.provider';

@Module({
  imports: [DatabaseModule, PlayersModule, CategoryModule],
  controllers: [ChallengesController],
  providers: [ChallengesService, ...ChallengesProvider, ...MatchsProvider],
})
export class ChallengesModule {}
