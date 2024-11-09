import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateTimeChallenge: { type: Date },
    status: { type: String },
    dateTimeRequest: { type: Date },
    dateTimeResponse: { type: Date },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'matchs',
    },
  },
  { timestamps: true, collection: 'challenges' }
);
