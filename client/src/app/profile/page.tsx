"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { useNFT } from "@/contexts/NFTContext"
import { Button } from "@/components/ui/button"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    type: "purchase",
    nftName: "Digital Art #1",
    amount: "0.1 ETH",
    date: "2024-03-15",
    status: "completed"
  },
  {
    id: 2,
    type: "sale",
    nftName: "Crypto Punk #2",
    amount: "0.25 ETH",
    date: "2024-03-14",
    status: "completed"
  },
  {
    id: 3,
    type: "purchase",
    nftName: "Abstract Collection",
    amount: "0.15 ETH",
    date: "2024-03-13",
    status: "completed"
  }
]

export default function ProfilePage() {
  const { address, isConnecting, connectWallet, user } = useWallet()
  const { getUserNFTs } = useNFT()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("owned")
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [createdNFTs, setCreatedNFTs] = useState<any[]>([])
  const [transactions, setTransactions] = useState(mockTransactions)
  const [isLoading, setIsLoading] = useState(true)
  const [avatar, setAvatar] = useState<string | undefined>(undefined)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      if (address) {
        try {
          // Fetch user's NFTs
          const userNFTs = getUserNFTs(address)
          setOwnedNFTs(userNFTs)
          setCreatedNFTs(userNFTs.filter((nft: any) => nft.creator === address))
        } catch (error) {
          console.error('Error loading NFTs:', error)
          toast.error("Failed to load NFTs", {
            description: "Please try again later"
          })
        }
      }
      setIsLoading(false)
    }

    loadData()
  }, [address, getUserNFTs])

  const handleAvatarChange = async (file: File) => {
    try {
      // Create form data
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('walletAddress', address || '')

      // Upload avatar
      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const data = await response.json()
      setAvatar(data.avatarUrl)
      
      toast.success("Avatar updated", {
        description: "Your profile photo has been updated successfully"
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error("Failed to update avatar", {
        description: "Please try again later"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to view your profile and NFTs
          </p>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <AvatarUpload
              currentAvatar={avatar}
              onAvatarChange={handleAvatarChange}
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-4">
              {address.slice(0, 6)}...{address.slice(-4)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              NFT Collector & Creator
            </p>
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={() => router.push("/create")}
              >
                Create NFT
              </Button>
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={() => router.push("/marketplace")}
              >
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
            <Button
              variant={activeTab === "owned" ? "default" : "ghost"}
              className={`rounded-full ${
                activeTab === "owned"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("owned")}
            >
              Owned NFTs
            </Button>
            <Button
              variant={activeTab === "created" ? "default" : "ghost"}
              className={`rounded-full ${
                activeTab === "created"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("created")}
            >
              Created NFTs
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "ghost"}
              className={`rounded-full ${
                activeTab === "transactions"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {activeTab === "owned" && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ownedNFTs.length > 0 ? (
                ownedNFTs.map((nft) => (
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
                          variant="outline"
                          className="border-purple-200 text-purple-600 hover:bg-purple-50"
                          onClick={() => router.push(`/marketplace/${nft.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't own any NFTs yet
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "created" && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {createdNFTs.length > 0 ? (
                createdNFTs.map((nft) => (
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
                          variant="outline"
                          className="border-purple-200 text-purple-600 hover:bg-purple-50"
                          onClick={() => router.push(`/marketplace/${nft.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven't created any NFTs yet
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      NFT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.nftName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 