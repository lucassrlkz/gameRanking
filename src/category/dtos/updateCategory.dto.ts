import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { Event } from 'src/common/interfaces/category.interface';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
