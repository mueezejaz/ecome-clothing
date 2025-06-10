import mongoose from "mongoose";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_uri;
if (!MONGODB_URI) {
  new ApiError(500, "mongo db uri is require")
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully!');
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;