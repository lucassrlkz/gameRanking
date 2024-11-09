import { Document } from 'mongoose';
import { Player } from './player.interface';
import { ChallengeStatus } from './challengeStatus.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeResponse: Date;
  applicant: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
