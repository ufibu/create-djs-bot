import { Schema, model } from "mongoose";

interface IUser {
  userId: string;
  guildId: string;
  balance: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default model<IUser>("User", userSchema);
