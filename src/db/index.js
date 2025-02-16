import mongoose, { connect } from "mongoose";

export let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/DAILYQUOTE`
    );
    dbInstance = connectionInstance;
    console.log(
      `MongoDB Connected! Db host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
