import { FileCard } from "@/components/marketplace/FileCard"

// Mock data for demonstration
const files = [
  {
    id: 1,
    title: "Financial Report Q1 2024",
    description: "Detailed financial analysis and projections for Q1 2024",
    price: "0.1 ETH",
    size: "2.5 MB",
    type: "PDF",
    imageUrl: "/images/financial-report.jpg"
  },
  {
    id: 2,
    title: "Product Design Files",
    description: "Complete product design documentation and assets",
    price: "0.25 ETH",
    size: "15 MB",
    type: "ZIP",
    imageUrl: "/images/product-design.jpg"
  },
  {
    id: 3,
    title: "Market Research Data",
    description: "Comprehensive market analysis and consumer insights",
    price: "0.15 ETH",
    size: "8 MB",
    type: "XLSX",
    imageUrl: "/images/market-research.jpg"
  },
  {
    id: 4,
    title: "Technical Documentation",
    description: "Complete technical specifications and API documentation",
    price: "0.2 ETH",
    size: "5 MB",
    type: "PDF",
    imageUrl: "/images/technical-docs.jpg"
  },
  {
    id: 5,
    title: "UI/UX Assets",
    description: "Collection of UI components and design assets",
    price: "0.3 ETH",
    size: "25 MB",
    type: "ZIP",
    imageUrl: "/images/ui-assets.jpg"
  },
  {
    id: 6,
    title: "Sales Analytics",
    description: "Detailed sales performance metrics and analysis",
    price: "0.18 ETH",
    size: "4 MB",
    type: "XLSX",
    imageUrl: "/images/sales-analytics.jpg"
  }
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            Discover Digital Assets
          </h1>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
            Browse and purchase high-quality digital files securely on the blockchain.
            Each purchase supports content creators directly.
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-4 rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg dark:shadow-purple-900/20">
            <button className="rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400">
              All Files
            </button>
            <button className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Documents
            </button>
            <button className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Designs
            </button>
            <button className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Data
            </button>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <FileCard key={file.id} {...file} />
          ))}
        </div>
      </div>
    </div>
  )
} 