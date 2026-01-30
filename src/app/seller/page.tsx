'use client'

import { useAccount } from 'wagmi'
import {
  useIsAuthorizedSeller,
  useContractOwner,
  useProductCount,
  useProduct,
  useListProduct,
  useModifyProduct,
} from '@/hooks/useContract'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatEther, getCategoryName, truncateAddress, parseEther } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { CATEGORIES } from '@/lib/contract'
import { Package, Plus, Edit, ShoppingBag } from 'lucide-react'
import { parseEther as viemParseEther } from 'viem'

export default function SellerPage() {
  const { address, isConnected } = useAccount()
  const { data: owner } = useContractOwner()
  const { data: isAuthorizedSeller } = useIsAuthorizedSeller(address)

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()
  const canSell = isOwner || isAuthorizedSeller

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to access the seller dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (!canSell) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Not Authorized</h1>
          <p className="text-muted-foreground">
            You need to be an authorized seller to access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and listings</p>
        </div>
        <ListProductDialog />
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">My Products</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <SellerProducts sellerAddress={address!} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ListProductDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('0')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [imageURI, setImageURI] = useState('')

  const { listProduct, isPending, isConfirming, isSuccess, error } = useListProduct()
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Product Listed!',
        description: 'Your product has been successfully listed.',
      })
      setOpen(false)
      resetForm()
    }
  }, [isSuccess, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const resetForm = () => {
    setName('')
    setDescription('')
    setCategory('0')
    setPrice('')
    setStock('')
    setImageURI('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    const priceInWei = viemParseEther(price)
    listProduct(
      name,
      description,
      parseInt(category),
      priceInWei,
      BigInt(stock),
      imageURI
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          List Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your store
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Classic White T-Shirt"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value.toString()}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH) *</Label>
              <Input
                id="price"
                type="number"
                step="0.0001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.05"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={imageURI}
              onChange={(e) => setImageURI(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || isConfirming}>
            {isPending || isConfirming ? 'Listing...' : 'List Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SellerProducts({ sellerAddress }: { sellerAddress: `0x${string}` }) {
  const { data: productCount, isLoading } = useProductCount()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const count = productCount ? Number(productCount) : 0
  const productIds = Array.from({ length: count }, (_, i) => BigInt(i + 1))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productIds.map((id) => (
        <SellerProductCard key={id.toString()} productId={id} sellerAddress={sellerAddress} />
      ))}
    </div>
  )
}

function SellerProductCard({
  productId,
  sellerAddress,
}: {
  productId: bigint
  sellerAddress: `0x${string}`
}) {
  const { data: product, isLoading } = useProduct(productId)

  if (isLoading) {
    return <div className="h-48 bg-muted rounded-lg animate-pulse" />
  }

  if (!product || product.seller.toLowerCase() !== sellerAddress.toLowerCase()) {
    return null
  }

  return <ProductManagementCard product={product} />
}

function ProductManagementCard({ product }: { product: any }) {
  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState(formatEther(product.priceInWei))
  const [stock, setStock] = useState(product.stockQuantity.toString())
  const [isActive, setIsActive] = useState(product.isActive)

  const { modifyProduct, isPending, isConfirming, isSuccess, error } = useModifyProduct()
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Product Updated!',
        description: 'Your product has been successfully updated.',
      })
      setOpen(false)
    }
  }, [isSuccess, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const priceInWei = viemParseEther(price)
    modifyProduct(product.id, priceInWei, BigInt(stock), isActive)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded-lg overflow-hidden shrink-0">
              {product.imageURI ? (
                <img
                  src={product.imageURI}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
              <CardDescription>
                {getCategoryName(product.category)}
              </CardDescription>
            </div>
          </div>
          <Badge variant={product.isActive ? 'default' : 'secondary'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">{formatEther(product.priceInWei)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Stock</p>
            <p className="font-medium">{Number(product.stockQuantity)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sales</p>
            <p className="font-medium">{Number(product.totalSales)}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="mr-2 h-3 w-3" />
              Edit Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update {product.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (ETH)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.0001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-active">Active (visible in store)</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isPending || isConfirming}>
                {isPending || isConfirming ? 'Updating...' : 'Update Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
