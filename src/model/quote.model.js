import mongoose, { Schema } from "mongoose";

    const quoteSchmea = new Schema(
    {
        quote: { type: String },
        author: { type: String },
    },
    { timestamps: true }
    );

export const Quote = mongoose.model("Quote", quoteSchmea);
