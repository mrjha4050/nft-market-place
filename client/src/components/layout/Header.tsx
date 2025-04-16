"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { WalletConnect } from "@/components/WalletConnect"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="MFT Logo" 
              width={32} 
              height={32} 
              className="rounded-lg"
            />
            <span className="text-xl font-bold">MFT Marketplace</span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center space-x-6 text-sm">
          <Link 
            href="/marketplace" 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Marketplace
          </Link>
          <Link 
            href="/create" 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Create
          </Link>
          <Link 
            href="/my-files" 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            My Files
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <WalletConnect />
        </div>
      </div>
    </header>
  )
} 