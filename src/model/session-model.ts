import mongoose, { Schema, Document } from "mongoose";

export interface ISession  {
  _id: string | mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
  experience: number;
  topicsToFocus: string;
  noOfQuestions: number;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    experience: { type: Number, required: true },
    topicsToFocus: { type: String, required: true },
    noOfQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model<ISession>("Session", sessionSchema);
