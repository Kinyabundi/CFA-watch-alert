import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err)
  }
};

export default connectdb