const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  tokenizedAssets: [
    {
      contractAddress: String,
      assetType: String,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
