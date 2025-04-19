"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/contexts/WalletContext'
import { toast } from 'sonner'
import { sendTransaction } from '@/utils/ethereum'

interface NFT {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  creator: string
  createdAt: string
}

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { address } = useWallet()
  const [nft, setNft] = useState<NFT | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const response = await fetch(`/api/nft/${params.id}`)
        if (!response.ok) {
          throw new Error('NFT not found')
        }
        const data = await response.json()
        setNft(data.nft)
      } catch (error) {
        console.error('Error fetching NFT:', error)
        toast.error('Failed to load NFT', {
          description: 'The NFT could not be found or loaded'
        })
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }

    fetchNFT()
  }, [params.id, router])

  const handlePurchase = async () => {
    if (!nft || !address) return

    try {
      setPurchasing(true)

      // Send the transaction
      await sendTransaction({
        from: address,
        to: nft.creator,
        value: nft.price
      })

      // Update NFT ownership in your backend
      const response = await fetch(`/api/nft/${nft.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyer: address
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update NFT ownership')
      }

      // Redirect to My Files page
      router.push('/my-files')
    } catch (error) {
      console.error('Purchase error:', error)
      // Error is already handled by sendTransaction
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!nft) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* NFT Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
            <Image
              src={nft.imageUrl}
              alt={nft.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* NFT Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {nft.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {nft.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nft.price} ETH
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Creator</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {nft.creator}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(nft.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {!address ? (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => router.push('/')}
                >
                  Connect Wallet to Purchase
                </Button>
              ) : address === nft.creator ? (
                <Button
                  className="w-full"
                  variant="outline"
                  disabled
                >
                  You own this NFT
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={handlePurchase}
                  disabled={purchasing}
                >
                  {purchasing ? 'Processing...' : `Buy for ${nft.price} ETH`}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/marketplace')}
              >
                Back to Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 