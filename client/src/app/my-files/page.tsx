"use client"

import { useEffect } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { useNFT } from "@/contexts/NFTContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function MyFilesPage() {
  const router = useRouter()
  const { address } = useWallet()
  const { getUserNFTs } = useNFT()

  useEffect(() => {
    if (!address) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to view your NFTs"
      })
      router.push('/')
    }
  }, [address, router])

  const userNFTs = address ? getUserNFTs(address) : []

  return (
    <div className="container max-w-7xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">My NFTs</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          View and manage your NFT collection
        </p>
        <Button
          onClick={() => router.push('/create')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Create New NFT
        </Button>
      </div>

      {userNFTs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            You haven't created any NFTs yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {userNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {nft.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {nft.price} ETH
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Created {new Date(nft.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 