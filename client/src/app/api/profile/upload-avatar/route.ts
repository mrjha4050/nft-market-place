import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const avatar = formData.get('avatar') as File
    const walletAddress = formData.get('walletAddress') as string

    if (!avatar || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create avatars directory if it doesn't exist
    const avatarsDir = join(process.cwd(), 'public', 'avatars')
    try {
      await writeFile(join(avatarsDir, '.keep'), '')
    } catch (error) {
      // Directory already exists
    }

    // Generate unique filename
    const ext = avatar.name.split('.').pop()
    const filename = `${walletAddress.toLowerCase()}_${Date.now()}.${ext}`
    const avatarPath = join(avatarsDir, filename)

    // Convert File to Buffer
    const bytes = await avatar.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    await writeFile(avatarPath, buffer)

    // Update user in database
    const { db } = await connectToDatabase()
    await db.collection('users').updateOne(
      { walletAddress },
      { 
        $set: { 
          avatarUrl: `/avatars/${filename}`,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true,
      avatarUrl: `/avatars/${filename}`
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload avatar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 