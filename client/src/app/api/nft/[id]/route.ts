import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you would fetch this from a database
    // For now, we'll return a mock response
    const nft = {
      id: params.id,
      name: "Sample NFT",
      description: "This is a sample NFT description",
      price: "0.1",
      imageUrl: "/nfts/" + params.id + ".jpg", // Assuming jpg extension
      creator: "0x1234...5678", // Mock creator address
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ nft })
  } catch (error) {
    console.error('Error fetching NFT:', error)
    return NextResponse.json(
      { error: 'NFT not found' },
      { status: 404 }
    )
  }
} 