import { IsNotEmpty } from 'class-validator';
import { Player } from '../../common/interfaces/player.interface';
import { Result } from '../../common/interfaces/challenge.interface';

export class LinkChallengeToMatchDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
