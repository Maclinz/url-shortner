import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log("Connected to Db");
  } catch (error) {
    console.log("Error connecting to db: ", error);
    process.exit(1);
  }
};

export default connect;
