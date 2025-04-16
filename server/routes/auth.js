const express = require('express');
const { registerUser } = require('../controllers/userController');
const router = express.Router();
const User = require('../models/User');

router.post('/register', registerUser);

// Register/Login with wallet address
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Find user or create if doesn't exist
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase()
      });
    } else {
      // Update last login
      user.lastLogin = Date.now();
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
