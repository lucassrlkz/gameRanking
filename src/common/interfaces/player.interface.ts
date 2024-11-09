import { Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  readonly email: string;
  readonly phoneNumber: string;
  ranking: string;
  positionRanking: number;
  urlPhoto: string;
}
