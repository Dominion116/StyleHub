'use client'

import { useAccount } from 'wagmi'
import { useCustomerOrders, useOrder, useCancelOrder, useProduct } from '@/hooks/useContract'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatEther, getStatusName, getStatusColor, truncateAddress } from '@/lib/utils'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Package, Truck, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const { address, isConnected } = useAccount()
  const { data: orderIds, isLoading } = useCustomerOrders(address)

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to view your orders.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const orders = orderIds || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...orders].reverse().map((orderId) => (
            <OrderCard key={orderId.toString()} orderId={orderId} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCard({ orderId }: { orderId: bigint }) {
  const { data: order, isLoading: orderLoading } = useOrder(orderId)
  const { data: product, isLoading: productLoading } = useProduct(order?.productId || BigInt(0))
  const { cancelOrder, isPending, isConfirming, isSuccess, error } = useCancelOrder()
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled and refunded.',
      })
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

  if (orderLoading || productLoading || !order) {
    return <div className="h-40 bg-muted rounded-lg animate-pulse" />
  }

  const canCancel = order.status === 0 || order.status === 1 // PLACED or CONFIRMED

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Order #{orderId.toString()}</CardTitle>
        <Badge className={getStatusColor(order.status)}>
          {getStatusName(order.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 bg-muted rounded-lg overflow-hidden shrink-0">
            {product?.imageURI ? (
              <img
                src={product.imageURI}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/product/${order.productId}`} className="font-semibold hover:underline">
              {product?.name || `Product #${order.productId}`}
            </Link>
            <p className="text-sm text-muted-foreground">
              Quantity: {Number(order.quantity)}
            </p>
            <p className="text-sm font-medium">
              Total: {formatEther(order.totalAmount + order.platformFee)} ETH
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>
          {order.trackingNumber && (
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tracking Number</p>
                <p className="text-muted-foreground">{order.trackingNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Placed: {new Date(Number(order.placedAt) * 1000).toLocaleString()}
          {order.updatedAt !== order.placedAt && (
            <> • Updated: {new Date(Number(order.updatedAt) * 1000).toLocaleString()}</>
          )}
        </div>

        {canCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => cancelOrder(orderId)}
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
