const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  tokenizedAssets: [
    {
      contractAddress: String,
      assetType: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
