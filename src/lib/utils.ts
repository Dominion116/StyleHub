import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEther(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4)
}

export function parseEther(ether: string): bigint {
  return BigInt(Math.floor(parseFloat(ether) * 1e18))
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getCategoryName(category: number): string {
  const categories = ['Tops', 'Bottoms', 'Footwear', 'Accessories']
  return categories[category] || 'Unknown'
}

export function getStatusName(status: number): string {
  const statuses = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']
  return statuses[status] || 'Unknown'
}

export function getStatusColor(status: number): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-red-100 text-red-800',
    'bg-gray-100 text-gray-800'
  ]
  return colors[status] || 'bg-gray-100 text-gray-800'
}
