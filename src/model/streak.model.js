import mongoose, { Schema } from "mongoose";

const streakSchmea = new Schema(
  {
    name: { type: String },
    currentStreak: { type: Number },
    history: [Number],
    lastUpdated: { type: Date }, 
  },
  { timestamps: true }
);

export const Streak = mongoose.model("Streak", streakSchmea);
