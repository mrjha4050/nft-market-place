"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  error: null,
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerUser = async (walletAddress: string) => {
    try {
      await api.post('/auth/register', { walletAddress })
    } catch (error) {
      console.error("Error registering user:", error)
      setError("Failed to register user with backend")
    }
  }

  const connectWallet = async () => {
    try {
      console.log("Attempting to connect to MetaMask...")
      
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not detected")
        setError("MetaMask is not installed. Please install MetaMask to use this application.")
        return
      }

      console.log("MetaMask detected, checking if it's MetaMask...")
      if (!window.ethereum.isMetaMask) {
        console.error("Not MetaMask provider")
        setError("Please use MetaMask to connect your wallet.")
        return
      }

      console.log("Requesting accounts...")
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      console.log("Received accounts:", accounts)
      if (!accounts || accounts.length === 0) {
        console.error("No accounts found")
        setError("No accounts found in MetaMask. Please create or import an account.")
        return
      }

      const walletAddress = accounts[0]
      console.log("Connected to account:", walletAddress)
      
      setAddress(walletAddress)
      setIsConnected(true)
      setError(null)
      await registerUser(walletAddress)
    } catch (error: any) {
      console.error("Detailed MetaMask error:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
        data: error.data
      })

      let errorMessage = "Failed to connect to MetaMask"
      
      if (error.code === 4001) {
        errorMessage = "User denied account access"
      } else if (error.code === -32002) {
        errorMessage = "MetaMask is already processing a request. Please check your MetaMask extension."
      } else if (error.code === -32603) {
        errorMessage = "Internal MetaMask error. Please try again."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setError(null)
  }

  useEffect(() => {
    const checkConnection = async () => {
      console.log("Checking existing connection...")
      
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not detected on page load")
        setError("MetaMask is not installed")
        return
      }

      try {
        console.log("Checking existing accounts...")
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })

        console.log("Existing accounts:", accounts)
        if (accounts && accounts.length > 0) {
          const walletAddress = accounts[0]
          setAddress(walletAddress)
          setIsConnected(true)
          setError(null)
          await registerUser(walletAddress)
        }
      } catch (error: any) {
        console.error("Error checking connection:", error)
        setError("Failed to check MetaMask connection")
      }
    }

    checkConnection()

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log("Accounts changed:", accounts)
      
      if (!accounts || accounts.length === 0) {
        disconnectWallet()
      } else {
        const walletAddress = accounts[0]
        setAddress(walletAddress)
        setIsConnected(true)
        setError(null)
        await registerUser(walletAddress)
      }
    }

    window.ethereum?.on("accountsChanged", handleAccountsChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext) 