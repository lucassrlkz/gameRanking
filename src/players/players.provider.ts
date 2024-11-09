import { Mongoose } from 'mongoose';
import { PlayerSchema } from '../common/schema/player.schema';

export const PlayerProvider = [
  {
    provide: 'PLAYER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('players', PlayerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
