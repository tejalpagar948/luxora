const mongoose = require('mongoose');

let cachedConnectionPromise = null;

/**
 * Establish connection to MongoDB, reusing existing connection if available.
 */
const connectDB = async () => {
  // 1. If already connected, reuse the active connection
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB: Using existing connection');
    return mongoose.connection;
  }

  // 2. If a connection attempt is already in progress, await it
  if (cachedConnectionPromise) {
    console.log('MongoDB: Awaiting existing connection promise');
    await cachedConnectionPromise;
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  console.log('MongoDB: Establishing new connection...');
  
  // Cache the connection promise
  cachedConnectionPromise = mongoose.connect(mongoURI, {
    bufferCommands: false, // Fail fast if connection fails
  });

  try {
    await cachedConnectionPromise;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    cachedConnectionPromise = null; // Reset cache on failure
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB Error occurred: ${err.message}`);
});

module.exports = connectDB;
