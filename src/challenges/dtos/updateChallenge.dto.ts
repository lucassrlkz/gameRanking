import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../../common/interfaces/challengeStatus.enum';

export class UpdateChallengeDto {
  @IsOptional()
  dateTimeChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;
}
