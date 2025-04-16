"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { NFT } from '@/types/nft'
import { useWallet } from './WalletContext'

interface NFTContextType {
  nfts: NFT[]
  addNFT: (nft: NFT) => void
  getUserNFTs: (address: string) => NFT[]
}

const NFTContext = createContext<NFTContextType | undefined>(undefined)

export function NFTProvider({ children }: { children: React.ReactNode }) {
  const [nfts, setNFTs] = useState<NFT[]>([])
  const { address } = useWallet()

  // Load NFTs from localStorage on mount
  useEffect(() => {
    const storedNFTs = localStorage.getItem('nfts')
    if (storedNFTs) {
      setNFTs(JSON.parse(storedNFTs))
    }
  }, [])

  // Save NFTs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nfts', JSON.stringify(nfts))
  }, [nfts])

  const addNFT = (nft: NFT) => {
    setNFTs(prev => [...prev, nft])
  }

  const getUserNFTs = (address: string) => {
    return nfts.filter(nft => nft.owner.toLowerCase() === address.toLowerCase())
  }

  return (
    <NFTContext.Provider value={{ nfts, addNFT, getUserNFTs }}>
      {children}
    </NFTContext.Provider>
  )
}

export function useNFT() {
  const context = useContext(NFTContext)
  if (context === undefined) {
    throw new Error('useNFT must be used within an NFTProvider')
  }
  return context
} 