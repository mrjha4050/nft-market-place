"use client"

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface EthereumError extends Error {
  code: number;
  data?: any;
}

interface User {
  walletAddress: string;
  createdAt: string;
  lastLogin: string;
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask browser extension to connect."
      })
      return
    }

    if (isConnecting) return // Prevent multiple connection attempts

    try {
      setIsConnecting(true)
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const walletAddress = accounts[0]

      // Register user in backend
      const response = await fetch('/api/auth/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect wallet')
      }

      setUser(data.user)
      
      toast.success("Wallet Connected", {
        description: "Your wallet has been successfully connected!"
      })

    } catch (error) {
      console.error('Error connecting wallet:', error)
      
      // Handle specific MetaMask errors
      if ((error as EthereumError).code) {
        const ethError = error as EthereumError
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
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting])

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setUser(null)
        toast.info("Wallet Disconnected", {
          description: "Your wallet has been disconnected"
        })
      } else {
        connectWallet() // Reconnect with new account
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
  }, [connectWallet])

  if (user) {
    return (
      <Button 
        variant="outline"
        className="border-purple-200 text-purple-600 hover:bg-purple-50"
        onClick={() => {
          setUser(null)
          toast.success("Wallet Disconnected", {
            description: "Your wallet has been disconnected successfully"
          })
        }}
      >
        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
      </Button>
    )
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
} 