import * as mongoose from 'mongoose';
import 'dotenv/config';

export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      if (!process.env.DB_CONNECTION) {
        throw new Error('DB_CONNECTION não esta configurado e é obrigatório para o serviço funcionar');
      }
      return  await mongoose.connect(process.env.DB_CONNECTION);
    },
  },
];
