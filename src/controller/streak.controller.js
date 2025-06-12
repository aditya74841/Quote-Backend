import { Streak } from "../model/streak.model.js";

const createStreak = async (req, res) => {
  try {
    const { name, currentStreak = 0 } = req.body;
    if (!name) {
      return res.status(404).json({ message: "Name is required" });
    }

    const streak = await Streak.create({
      name,
      currentStreak,
    });
    if (!streak) {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating the streak" });
    }

    return res
      .status(201)
      .json({ streak, message: "Streak created successfully" });
  } catch (error) {
    return res.status(404).json({ error, message: "Failed to create Streak" });
  }
};

const getStreak = async (req, res) => {
  try {
    const streak = await Streak.find();
    return res
      .status(200)
      .json({ streak, message: "Streak fetched successfully" });
  } catch (error) {
    return res.status(404).json({ error, message: "Failed to fetch streak" });
  }
};

const changeStreak = async (req, res) => {
  try {
    const { streakId } = req.params;

    const { currentStreak } = req.body;

    if (!streakId) {
      return res.status(404).json({ message: "Streak Id is required" });
    }

    const streak = await Streak.findById(streakId);
    streak.history.push(streak.currentStreak);
    streak.currentStreak = currentStreak;

    await streak.save();
    return res
      .status(201)
      .json({ streak, message: "Current streak changed  successfully" });
  } catch (error) {
    return res.status(404).json({ error, message: "Failed to change streak" });
  }
};

const updateStreak = async (req, res) => {
  try {
    const { streakId } = req.params;

    const { name, currentStreak } = req.body;

    if (!streakId) {
      return res.status(404).json({ message: "Streak Id is required" });
    }

    const streak = await Streak.findById(streakId);

    streak.name = name;
    streak.currentStreak = currentStreak;

    await streak.save();
    return res
      .status(201)
      .json({ streak, message: "Streak updated  successfully" });
  } catch (error) {
    return res.status(404).json({ error, message: "Failed to update streak" });
  }
};
const deleteStreak = async (req, res) => {
  try {
    const { streakId } = req.params;

    await Streak.findByIdAndDelete(streakId);
    return res.status(201).json({ message: " streak deleted  successfully" });
  } catch (error) {
    return res.status(404).json({ error, message: "Failed to delete streak" });
  }
};

const autoUpdateStreakDaily = async (req, res) => {
  try {
    const today = new Date();
    const allStreaks = await Streak.find();

    const updatedStreaks = [];

    for (const streak of allStreaks) {
      const lastUpdated = streak.lastUpdated;

      const hasUpdatedToday =
        lastUpdated && lastUpdated.toDateString() === today.toDateString();

      if (!hasUpdatedToday) {
        streak.currentStreak += 1;
        streak.lastUpdated = today;
        await streak.save();
        updatedStreaks.push(streak);
      }
    }

    return res.status(200).json({
      message: `Auto-updated ${updatedStreaks.length} streak(s) for today`,
      updatedStreaks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to auto-update streaks",
      error: error.message,
    });
  }
};

export {
  createStreak,
  getStreak,
  changeStreak,
  updateStreak,
  deleteStreak,
  autoUpdateStreakDaily,
};
