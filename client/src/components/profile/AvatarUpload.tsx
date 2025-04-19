"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (file: File) => void
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  // Using a random avatar from Unsplash as default
  const defaultAvatar = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&h=200&fit=crop"
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || defaultAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please upload an image file"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB"
      })
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onAvatarChange(file)

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(url)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative group">
      <div className="relative w-32 h-32">
        <Image
          src={previewUrl}
          alt="Profile"
          fill
          className="rounded-full object-cover"
          unoptimized={previewUrl.startsWith('http')} // Skip optimization for external URLs
        />
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
          onClick={handleClick}
        >
          <span className="text-white text-sm">Change Photo</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
          />
        </svg>
      </Button>
    </div>
  )
} 