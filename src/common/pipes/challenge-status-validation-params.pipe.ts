import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAllowed = [
    ChallengeStatus.ACEITO,
    ChallengeStatus.NEGADO,
    ChallengeStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();
    if (!this.validStatus(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private validStatus(status: any) {
    const index = this.statusAllowed.indexOf(status);
    return index !== -1;
  }
}
