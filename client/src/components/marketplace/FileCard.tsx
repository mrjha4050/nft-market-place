"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FileCardProps {
  id: number
  title: string
  description: string
  price: string
  size: string
  type: string
  imageUrl?: string
}

export function FileCard({ id, title, description, price, size, type, imageUrl }: FileCardProps) {
  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'zip':
        return 'bg-blue-100 text-blue-800'
      case 'xlsx':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '/icons/pdf-icon.svg'
      case 'zip':
        return '/icons/zip-icon.svg'
      case 'xlsx':
        return '/icons/excel-icon.svg'
      default:
        return '/icons/file-icon.svg'
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/20 hover:scale-[1.02] h-full flex flex-col dark:border-gray-800">
      <div className="relative h-56 w-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image
              src={getFileIcon(type)}
              alt={type}
              width={64}
              height={64}
              className="opacity-50 dark:opacity-40"
            />
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getFileTypeColor(type)} dark:bg-opacity-20`}>
            {type}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{size}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{price}</span>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white">
            Purchase
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 