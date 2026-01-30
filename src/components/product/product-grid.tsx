'use client'

import { useProductCount, useProduct } from '@/hooks/useContract'
import { ProductCard } from './product-card'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/contract'
import { Button } from '@/components/ui/button'

export function ProductGrid() {
  const { data: productCount, isLoading } = useProductCount()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const count = productCount ? Number(productCount) : 0
  const productIds = Array.from({ length: count }, (_, i) => BigInt(i + 1))

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {count === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productIds.map((id) => (
            <ProductCardWithFilter
              key={id.toString()}
              productId={id}
              selectedCategory={selectedCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCardWithFilter({
  productId,
  selectedCategory,
}: {
  productId: bigint
  selectedCategory: number | null
}) {
  const { data: product } = useProduct(productId)

  if (selectedCategory !== null && product && product.category !== selectedCategory) {
    return null
  }

  return <ProductCard productId={productId} />
}
