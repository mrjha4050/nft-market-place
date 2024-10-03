const User = require('../models/User');

const registerUser = async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const user = new User({ walletAddress });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

module.exports = { registerUser };
