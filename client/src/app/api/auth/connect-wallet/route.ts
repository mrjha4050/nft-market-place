import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: Request) {
  try {
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error('Invalid JSON in request body:', error)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Connect to database
    let db
    try {
      const { db: database } = await connectToDatabase()
      db = database
    } catch (error) {
      console.error('MongoDB connection error:', error)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 503 }
      )
    }

    try {
      // Check if user already exists
      let user = await db.collection('users').findOne({ walletAddress })

      if (!user) {
        // Create new user
        const newUser = new User({
          walletAddress,
          createdAt: new Date(),
          lastLogin: new Date()
        })

        const result = await db.collection('users').insertOne(newUser)
        user = { ...newUser, _id: result.insertedId }
      } else {
        // Update last login
        await db.collection('users').updateOne(
          { walletAddress },
          { $set: { lastLogin: new Date() } }
        )
      }

      // Remove MongoDB _id from response
      const { _id, ...userWithoutId } = user

      return new NextResponse(
        JSON.stringify({ 
          success: true,
          user: userWithoutId
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      console.error('Database operation error:', error)
      return NextResponse.json(
        { 
          error: 'Database operation failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in connect-wallet route:', error)
    return NextResponse.json(
      { 
        error: 'Failed to connect wallet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 