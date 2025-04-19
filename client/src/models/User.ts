export class User {
  walletAddress: string
  createdAt: Date
  lastLogin: Date

  constructor(data: {
    walletAddress: string
    createdAt: Date
    lastLogin: Date
  }) {
    this.walletAddress = data.walletAddress.toLowerCase()
    this.createdAt = data.createdAt
    this.lastLogin = data.lastLogin
  }
} 