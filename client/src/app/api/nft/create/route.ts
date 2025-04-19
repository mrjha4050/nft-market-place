import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { storeNFT } from '../user/route'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const image = formData.get('image') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const creator = formData.get('creator') as string

    if (!image || !name || !description || !price || !creator) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const nftId = uuidv4()

    const ext = image.name.split('.').pop()?.toLowerCase() || 'jpg'

    // Create filename with NFT ID
    const filename = `${nftId}.${ext}`

    // Ensure directory exists
    const publicDir = join(process.cwd(), 'public')
    const nftDir = join(publicDir, 'nfts')
    
    try {
      await writeFile(join(nftDir, '.keep'), '')
    } catch (error) {
      // Directory already exists, continue
    }

    // Convert file to buffer and save
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    const filepath = join(nftDir, filename)
    await writeFile(filepath, buffer)

    // Create NFT object
    const nft = {
      id: nftId,
      name,
      description,
      price,
      imageUrl: `/nfts/${filename}`,
      creator,
      createdAt: new Date().toISOString()
    }

    // Store NFT data
    storeNFT(nft)

    return NextResponse.json({ 
      success: true,
      nft 
    })

  } catch (error) {
    console.error('Error creating NFT:', error)
    return NextResponse.json(
      { error: 'Failed to create NFT' },
      { status: 500 }
    )
  }
} 