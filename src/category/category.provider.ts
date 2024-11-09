import { Mongoose } from 'mongoose';
import { CategorySchema } from '../common/schema/category.schema';

export const CategoryProvider = [
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('categories', CategorySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
