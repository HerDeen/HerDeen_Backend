import mongoose from "mongoose";
import { dburi } from "./system.variable";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dburi}`);
    console.log("database connected");
  } catch (error) {
    console.log("database disconnected");
  }
};
