export class NFT {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  creator: string
  owner: string
  createdAt: Date
  updatedAt: Date

  constructor(data: {
    id?: string
    name: string
    description: string
    price: string
    imageUrl: string
    creator: string
    owner: string
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.id = data.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.name = data.name
    this.description = data.description
    this.price = data.price
    this.imageUrl = data.imageUrl
    this.creator = data.creator.toLowerCase()
    this.owner = data.owner.toLowerCase()
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
} 