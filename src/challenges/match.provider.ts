import { Mongoose } from 'mongoose';
import { MatchSchema } from '../common/schema/match.schema';

export const MatchsProvider = [
  {
    provide: 'MATCH_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('matchs', MatchSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
