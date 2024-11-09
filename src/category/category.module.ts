import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '../database/database.module';
import { CategoryProvider } from './category.provider';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [DatabaseModule, PlayersModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...CategoryProvider],
  exports: [CategoryService],
})
export class CategoryModule {}
