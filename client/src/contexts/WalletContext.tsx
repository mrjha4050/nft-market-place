"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface User {
  walletAddress: string
  createdAt: string
  lastLogin: string
}

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  user: User | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  user: null
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const registerUser = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to register user')
      }

      setUser(data.user)
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask browser extension to connect."
      })
      return
    }

    if (isConnecting) return

    try {
      setIsConnecting(true)
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const walletAddress = accounts[0]
      setAddress(walletAddress)
      await registerUser(walletAddress)
      
      toast.success("Wallet Connected", {
        description: "Your wallet has been successfully connected!"
      })

    } catch (error) {
      console.error('Error connecting wallet:', error)
      
      if ((error as any).code) {
        const ethError = error as { code: number; message: string }
        switch (ethError.code) {
          case 4001:
            toast.error("Connection Rejected", {
              description: "You rejected the connection request"
            })
            break
          case -32002:
            toast.error("Connection Pending", {
              description: "Please check MetaMask to complete the connection"
            })
            break
          case -32603:
            toast.error("Connection Error", {
              description: "Internal MetaMask error. Please try again"
            })
            break
          default:
            toast.error("Connection Failed", {
              description: ethError.message || "Failed to connect wallet"
            })
        }
      } else {
        toast.error("Connection Failed", {
          description: error instanceof Error ? error.message : "Failed to connect wallet"
        })
      }
      setAddress(null)
      setUser(null)
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting, registerUser])

  const disconnectWallet = useCallback(() => {
    setAddress(null)
    setUser(null)
    toast.success("Wallet Disconnected", {
      description: "Your wallet has been disconnected successfully"
    })
  }, [])

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== address) {
        setAddress(accounts[0])
        registerUser(accounts[0])
      }
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [address, disconnectWallet, registerUser])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        connectWallet,
        disconnectWallet,
        user
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 