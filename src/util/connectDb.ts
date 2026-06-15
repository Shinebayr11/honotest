import mongoose from "mongoose";
const URI = process.env.MONGODB_URI;

export const connectDb = async () => {
  try {
    if (!URI) {
      console.log("URI baihgui");
      return;
    }
    await mongoose.connect(URI);
    console.log("DB holbogdson");
  } catch (error) {
    console.log("DB aldaa", error);
  }
};
