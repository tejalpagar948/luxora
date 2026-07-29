const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Get health status of the API
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

module.exports = router;
