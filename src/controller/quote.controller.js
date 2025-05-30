import { Quote } from "../model/quote.model.js";

import fetch from "node-fetch";
import cron from "node-cron";
import axios from "axios";

// Function to fetch and store the daily quote
const storeQuote = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    console.log("Today's date:", today);

    // Check if a quote already exists for today based on `tdate`
    const existingQuote = await Quote.findOne({ tdate: today });

    console.log("Existing quote:", existingQuote);

    if (existingQuote) {
      return res
        .status(409) // Use 409 Conflict instead of 404
        .json({ message: "A quote for today already exists. Skipping..." });
    }

    // Fetch the quote from ZenQuotes API
    const { data } = await axios.get("https://zenquotes.io/api/today");

    if (!data || !data.length) {
      console.log("No quote received.");
      return res.status(500).json({ message: "Failed to fetch quote." });
    }

    const { q: quote, a: author } = data[0]; // Extract quote and author

    // Create and save the new quote with `tdate`
    const newQuote = new Quote({ quote, author, tdate: today });
    await newQuote.save();

    return res.status(201).json({ message: "Quote saved successfully" });
  } catch (error) {
    console.error("Error fetching or storing the quote:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTodayQuote = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Find the quote stored for today using the `tdate` field
    const todayQuote = await Quote.findOne({ tdate: today });

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
    const quotes = await Quote.find({ createdAt: { $lt: today } }).sort({
      createdAt: -1,
    });

    res.status(200).json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    next(error); // Pass error to middleware if available
  }
};

// const translateAndExplainQuote = async (req, res) => {
//   try {
//     const { quote, author } = req.body;
   

//     if (!quote) {
//       return res.status(400).json({ message: "Quote is required." });
//     }

//     // Prompt for Gemini to translate and explain the quote
//     const prompt = `
// Translate the following quote into Hindi and then provide a thoughtful explanation of its meaning in English in 100 words.

// Quote: "${quote}"
//     `;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const geminiOutput =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!geminiOutput) {
//       return res
//         .status(500)
//         .json({ message: "Failed to generate translation and explanation." });
//     }

//     return res.status(200).json({
//       original: quote,
//       author,
//       explanation: geminiOutput.trim(),
//     });
//   } catch (error) {
//     console.error("Gemini API error:", error.response?.data || error.message);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.response?.data || error.message,
//     });
//   }
// };


const translateQuoteToHindi = async (req, res) => {
  try {
    const { quote } = req.body;

    if (!quote) {
      return res.status(400).json({ message: "Quote is required." });
    }

    // const prompt = `Translate the following quote into Hindi:\n\n"${quote}"`;
    const prompt = `Translate this quote into Hindi. Return **only one single-line Hindi translation** without any explanation or formatting:

    "${quote}"`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const translation = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translation) {
      return res.status(500).json({ message: "Failed to generate translation." });
    }

    return res.status(200).json({
      original: quote,
      hindi_translation: translation.trim(),
    });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.response?.data || error.message,
    });
  }
};

// 2️⃣ Explain quote in English
const explainQuoteInEnglish = async (req, res) => {
  try {
    const { quote } = req.body;

    if (!quote) {
      return res.status(400).json({ message: "Quote is required." });
    }

    const prompt = `Explain the following quote in clear, simple English within 100 words:\n\n"${quote}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const explanation = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explanation) {
      return res.status(500).json({ message: "Failed to generate explanation." });
    }

    return res.status(200).json({
      original: quote,
      explanation: explanation.trim(),
    });
  } catch (error) {
    console.error("Explanation error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.response?.data || error.message,
    });
  }
};

export { storeQuote, getTodayQuote, getAllQuotes, translateQuoteToHindi,explainQuoteInEnglish };
