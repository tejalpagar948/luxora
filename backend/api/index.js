const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  try {
    // Await database connection before processing routes
    await connectDB();
    
    // Hand over the request to Express
    return app(req, res);
  } catch (error) {
    console.error('Serverless entrypoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to establish database connection.',
      error: error.message,
    });
  }
};
