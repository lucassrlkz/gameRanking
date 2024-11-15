import * as mongoose from 'mongoose';
import 'dotenv/config';

export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(process.env.DB_CONNECTION),
  },
];
