'use client'

import { useProduct, type Product } from '@/hooks/useContract'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatEther, getCategoryName } from '@/lib/utils'
import Link from 'next/link'
import { Package } from 'lucide-react'

interface ProductCardProps {
  productId: bigint
}

export function ProductCard({ productId }: ProductCardProps) {
  const { data: product, isLoading } = useProduct(productId)

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="aspect-square bg-muted" />
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2 mt-2" />
        </CardHeader>
        <CardFooter>
          <div className="h-8 bg-muted rounded w-full" />
        </CardFooter>
      </Card>
    )
  }

  if (!product || !product.isActive) {
    return null
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-muted relative">
        {product.imageURI ? (
          <img
            src={product.imageURI}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {product.stockQuantity === BigInt(0) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <Badge variant="secondary" className="shrink-0">
            {getCategoryName(product.category)}
          </Badge>
        </div>
        <p className="text-lg font-bold">{formatEther(product.priceInWei)} ETH</p>
        <p className="text-sm text-muted-foreground">
          {Number(product.stockQuantity)} in stock • {Number(product.totalSales)} sold
        </p>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${productId}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
