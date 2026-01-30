import { ProductGrid } from '@/components/product/product-grid'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fashion Marketplace</h1>
        <p className="text-muted-foreground">
          Discover unique fashion items on the blockchain
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}
