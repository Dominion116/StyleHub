'use client'

import { useParams } from 'next/navigation'
import { useProduct, useCreateOrder, usePlatformFee } from '@/hooks/useContract'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { formatEther, getCategoryName, truncateAddress } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Package, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const productId = BigInt(params.id as string)
  const { data: product, isLoading } = useProduct(productId)
  const { data: platformFee } = usePlatformFee()
  const { isConnected } = useAccount()
  const { createOrder, isPending, isConfirming, isSuccess, error } = useCreateOrder()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState('')

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Order Created!',
        description: 'Your order has been placed successfully.',
      })
      setQuantity(1)
      setDeliveryAddress('')
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product || product.id === BigInt(0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            This product doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const feePercent = platformFee ? Number(platformFee) : 2
  const subtotal = product.priceInWei * BigInt(quantity)
  const fee = (subtotal * BigInt(feePercent)) / BigInt(100)
  const total = subtotal + fee

  const handleOrder = () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a delivery address',
        variant: 'destructive',
      })
      return
    }
    createOrder(productId, BigInt(quantity), deliveryAddress, total)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {product.imageURI ? (
            <img
              src={product.imageURI}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{getCategoryName(product.category)}</Badge>
              {!product.isActive && <Badge variant="destructive">Inactive</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">{formatEther(product.priceInWei)} ETH</p>
          </div>

          <div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{Number(product.stockQuantity)} in stock</span>
            <span>•</span>
            <span>{Number(product.totalSales)} sold</span>
            <span>•</span>
            <span>Seller: {truncateAddress(product.seller)}</span>
          </div>

          <Separator />

          {product.isActive && product.stockQuantity > BigInt(0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={Number(product.stockQuantity)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(Number(product.stockQuantity), parseInt(e.target.value) || 1)))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                    <span>{formatEther(subtotal)} ETH</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Fee ({feePercent}%)</span>
                    <span>{formatEther(fee)} ETH</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatEther(total)} ETH</span>
                  </div>
                </div>

                {isConnected ? (
                  <Button
                    className="w-full"
                    onClick={handleOrder}
                    disabled={isPending || isConfirming}
                  >
                    {isPending || isConfirming ? (
                      'Processing...'
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Connect your wallet to place an order
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {product.stockQuantity === BigInt(0) && (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  This product is currently out of stock.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
