import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI)
{
    throw new Error('Please define the MONGODB_URI environment inside .env file.');
}

// Mongoose connection
let cached = global.mongoose;

if (!cached)
{
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase()
{
  if (cached.conn)
  {
    return cached.conn;
  }

  if (!cached.promise)
  {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    };

    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// MongoClient connection for NextAuth
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development')
{
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
  // Use a single instance if in production
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

clientPromise
  .then(() => console.log('MongoDB client connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

export { clientPromise };