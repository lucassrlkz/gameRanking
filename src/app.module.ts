import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { CategoryModule } from './category/category.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [PlayersModule, CategoryModule, ChallengesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
