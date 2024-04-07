const mongoose = require("mongoose");

// Assuming MONGODB_URI is set in your environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Use a global variable to store the cache
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

async function dbConnect() {
  if (cached.conn) {
    return cached.conn; // Use existing database connection if already connected
  }
  if (!cached.promise) {
    // Initiate connection only if there isn't a pending connection promise
    const opts = {
      bufferCommands: false, // Specific Mongoose options can be defined here
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise; // Wait for the connection to be established
  } catch (e) {
    cached.promise = null; // Reset promise to allow retrying in case of failure
    throw e;
  }

  return cached.conn;
}

module.exports = dbConnect;
