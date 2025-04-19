"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useWallet } from "@/contexts/WalletContext"
import { toast } from "sonner"

// Mock data for demonstration
const nfts = [
  {
    id: 1,
    name: "Digital Art #1",
    description: "A unique piece of digital art created using AI",
    price: "0.1 ETH",
    imageUrl: "/images/nft1.jpg"
  },
  {
    id: 2,
    name: "Crypto Punk #2",
    description: "Rare crypto punk with unique attributes",
    price: "0.25 ETH",
    imageUrl: "/images/nft2.jpg"
  },
  {
    id: 3,
    name: "Abstract Collection",
    description: "Modern abstract digital artwork",
    price: "0.15 ETH",
    imageUrl: "/images/nft3.jpg"
  },
  {
    id: 4,
    name: "Digital Portrait",
    description: "AI-generated portrait with unique style",
    price: "0.2 ETH",
    imageUrl: "/images/nft4.jpg"
  },
  {
    id: 5,
    name: "3D Animation",
    description: "Animated 3D character design",
    price: "0.3 ETH",
    imageUrl: "/images/nft5.jpg"
  },
  {
    id: 6,
    name: "Pixel Art",
    description: "Retro-style pixel art collection",
    price: "0.18 ETH",
    imageUrl: "/images/nft6.jpg"
  }
]

export default function MarketplacePage() {
  const { address } = useWallet()
  const [purchasingId, setPurchasingId] = useState<number | null>(null)

  const handlePurchase = async (nftId: number) => {
    if (!address) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to make a purchase"
      })
      return
    }

    try {
      setPurchasingId(nftId)
      // Add your purchase logic here
      // For example: await purchaseNFT(nftId, address)
      
      toast.success("Purchase Successful", {
        description: "Your NFT has been purchased successfully"
      })
    } catch (error) {
      toast.error("Purchase Failed", {
        description: error instanceof Error ? error.message : "Failed to purchase NFT"
      })
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            NFT Marketplace
          </h1>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
            Discover and collect unique digital assets on the blockchain
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {nft.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {nft.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {nft.price}
                  </span>
                  <Button
                    onClick={() => handlePurchase(nft.id)}
                    disabled={purchasingId === nft.id}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {purchasingId === nft.id ? "Purchasing..." : "Purchase"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 