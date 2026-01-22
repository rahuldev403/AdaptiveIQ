import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Declare global type for MongoDB client caching
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
    console.log("🔄 MongoDB connection cached for dev mode");
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  const client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export async function connectDB() {
  const client = await clientPromise;
  console.log("✅ MongoDB connected");
  return client;
}

export async function getDB() {
  const client = await connectDB();
  return client.db();
}
