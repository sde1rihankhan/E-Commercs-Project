import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "ProductCart",
    });

    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;