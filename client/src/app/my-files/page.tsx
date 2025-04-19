"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

interface NFT {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  creator: string
  createdAt: string
}

export default function MyFilesPage() {
  const router = useRouter()
  const { address } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return

      try {
        const response = await fetch(`/api/nft/user?address=${address}`)
        if (!response.ok) {
          throw new Error('Failed to fetch NFTs')
        }
        const data = await response.json()
        setNfts(data.nfts)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        toast.error('Failed to load NFTs', {
          description: 'Please try again later'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [address])

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to view your NFTs
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My NFTs
            </h1>
            <Button
              onClick={() => router.push('/create')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Create New NFT
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No NFTs Created Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first NFT to get started
              </p>
              <Button
                onClick={() => router.push('/create')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Create NFT
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => router.push(`/marketplace/${nft.id}`)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={nft.imageUrl}
                      alt={nft.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {nft.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {nft.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {nft.price} ETH
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(nft.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 