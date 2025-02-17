import { Quote } from "../model/quote.model.js";

import fetch from "node-fetch";
import cron from "node-cron";
import axios from "axios";

// Function to fetch and store the daily quote
const storeQuote = async () => {
  try {
    console.log("checking the line 10");
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Check if a quote already exists for today
    const existingQuote = await Quote.findOne({
      createdAt: {
        $gte: new Date(today),
        $lt: new Date(today + "T23:59:59.999Z"),
      },
    });


    if (existingQuote) {
      console.log("A quote for today already exists. Skipping...");
      return;
    }

    // Fetch the quote from ZenQuotes API
    const { data } = await axios.get("https://zenquotes.io/api/today");

    if (!data || !data.length) {
      console.log("No quote received.");
      return;
    }

    // console.log("the Data is", data);
    const { q: quote, a: author } = data[0]; // Extract quote and author

    // Create and save the new quote
    const newQuote = new Quote({ quote, author });
    await newQuote.save();

    console.log("Quote stored successfully:", quote);
  } catch (error) {
    console.error("Error fetching or storing the quote:", error);
  }
};

// Schedule to run every day at midnight (00:00)
// cron.schedule("0 0 * * *", async () => {
//   console.log("Fetching new daily quote...");
//   await storeQuote();
// });


cron.schedule("1 0 * * *", async () => {
  console.log("Fetching new daily quote...");
  await storeQuote();
});
const getTodayQuote = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Find the quote stored for today
    const todayQuote = await Quote.findOne({
      createdAt: {
        $gte: new Date(today),
        $lt: new Date(today + "T23:59:59.999Z"),
      },
    });

    if (!todayQuote) {
      return res.status(404).json({ message: "No quote available for today." });
    }

    res.status(200).json(todayQuote);
  } catch (error) {
    console.error("Error fetching today's quote:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getAllQuotes = async (req, res, next) => {
  try {
    // Get today's start time (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all quotes except today, sorted from newest to oldest
    const quotes = await Quote.find({ createdAt: { $lt: today } }).sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    next(error); // Pass error to middleware if available
  }
};

export { storeQuote, getTodayQuote, getAllQuotes };
