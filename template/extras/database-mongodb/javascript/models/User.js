const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model("User", userSchema);
