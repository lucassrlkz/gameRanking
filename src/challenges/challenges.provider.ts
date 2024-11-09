import { Mongoose } from 'mongoose';
import { ChallengeSchema } from 'src/common/schema/challenge.schema';

export const ChallengesProvider = [
  {
    provide: 'CHALLENGE_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('challenges', ChallengeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
