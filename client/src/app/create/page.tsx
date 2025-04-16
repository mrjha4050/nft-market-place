"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/WalletContext"
import { useNFT } from "@/contexts/NFTContext"
import { v4 as uuidv4 } from 'uuid'

export default function CreateNFTPage() {
  const router = useRouter()
  const { address } = useWallet()
  const { addNFT } = useNFT()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null as File | null
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please upload an image file"
        })
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to create an NFT"
      })
      return
    }

    if (!formData.image) {
      toast.error("Image required", {
        description: "Please upload an image for your NFT"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // In a real application, you would:
      // 1. Upload the image to IPFS or similar
      // 2. Create the NFT contract
      // 3. Mint the NFT
      // For now, we'll just store it locally

      const newNFT = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        price: formData.price,
        imageUrl: imagePreview as string, // In production, this would be an IPFS URL
        owner: address,
        createdAt: new Date().toISOString()
      }

      addNFT(newNFT)
      
      toast.success("NFT Created!", {
        description: "Your NFT has been created successfully"
      })

      // Redirect to My Files page
      router.push('/my-files')

    } catch (error) {
      toast.error("Creation failed", {
        description: error instanceof Error ? error.message : "Failed to create NFT"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Create NFT</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create your unique NFT by uploading an image and providing details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md aspect-square relative border-2 border-dashed rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="NFT Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg
                      className="h-12 w-12"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Click to upload image
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter NFT name"
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium">
            Price (ETH)
          </label>
          <Input
            id="price"
            type="number"
            step="0.001"
            min="0"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Enter price in ETH"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your NFT"
            required
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create NFT"}
        </Button>
      </form>
    </div>
  )
} 