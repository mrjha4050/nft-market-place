import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

// In-memory store for NFTs (in a real app, this would be a database)
let nfts: any[] = []

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Filter NFTs by creator address
    const userNFTs = nfts.filter(nft => nft.creator.toLowerCase() === address.toLowerCase())

    return NextResponse.json({ nfts: userNFTs })
  } catch (error) {
    console.error('Error fetching user NFTs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}

// Helper function to store NFT data
export function storeNFT(nft: any) {
  nfts.push(nft)
} 