import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(process.env.MONGODB_URI);

let isConnected = false;

export async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("✅ MongoDB connected");
  }
  return client;
}

export async function getDB() {
  const client = await connectDB();
  return client.db();
}
