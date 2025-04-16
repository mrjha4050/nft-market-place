import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // For now, we'll just return success
    // In a real app, you would:
    // 1. Connect to MongoDB
    // 2. Create/update user record
    // 3. Return user data

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: walletAddress.toLowerCase(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in connect-wallet route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 