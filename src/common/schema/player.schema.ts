import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    ranking: String,
    positionRanking: Number,
    urlPhoto: String,
  },
  { timestamps: true, collection: 'players' }
);
