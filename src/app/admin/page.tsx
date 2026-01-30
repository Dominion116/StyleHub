'use client'

import { useAccount } from 'wagmi'
import {
  useContractOwner,
  useContractBalance,
  usePlatformFee,
  useOrderCount,
  useOrder,
  useProduct,
  useWithdrawFunds,
  useAuthorizeSeller,
  useRevokeSeller,
  useSetPlatformFee,
  useUpdateOrderStatus,
  useIsAuthorizedSeller,
} from '@/hooks/useContract'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { formatEther, getStatusName, getStatusColor, truncateAddress } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ORDER_STATUSES } from '@/lib/contract'
import {
  Settings,
  Wallet,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const { data: owner } = useContractOwner()

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            Only the contract owner can access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your marketplace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard />
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrdersManagement />
        </TabsContent>

        <TabsContent value="sellers" className="mt-6">
          <SellersManagement />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard() {
  const { data: balance } = useContractBalance()
  const { data: orderCount } = useOrderCount()
  const { data: platformFee } = usePlatformFee()

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contract Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {balance ? formatEther(balance) : '0'} ETH
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderCount?.toString() || '0'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platform Fee</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformFee?.toString() || '2'}%</div>
        </CardContent>
      </Card>
    </>
  )
}

function OrdersManagement() {
  const { data: orderCount, isLoading } = useOrderCount()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const count = orderCount ? Number(orderCount) : 0
  const orderIds = Array.from({ length: count }, (_, i) => BigInt(i + 1))

  if (count === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {[...orderIds].reverse().map((id) => (
        <AdminOrderCard key={id.toString()} orderId={id} />
      ))}
    </div>
  )
}

function AdminOrderCard({ orderId }: { orderId: bigint }) {
  const { data: order, isLoading } = useOrder(orderId)
  const { data: product } = useProduct(order?.productId || BigInt(0))
  const [open, setOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const { updateOrderStatus, isPending, isConfirming, isSuccess, error } = useUpdateOrderStatus()
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Order Updated',
        description: 'Order status has been updated.',
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

  useEffect(() => {
    if (order) {
      setNewStatus(order.status.toString())
      setTrackingNumber(order.trackingNumber)
    }
  }, [order])

  if (isLoading || !order) {
    return <div className="h-32 bg-muted rounded-lg animate-pulse" />
  }

  const handleUpdate = () => {
    updateOrderStatus(orderId, parseInt(newStatus), trackingNumber)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">Order #{orderId.toString()}</CardTitle>
          <CardDescription>
            {product?.name || `Product #${order.productId}`} × {Number(order.quantity)}
          </CardDescription>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {getStatusName(order.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Customer</p>
            <p className="font-medium">{truncateAddress(order.customer)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">{formatEther(order.totalAmount)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fee</p>
            <p className="font-medium">{formatEther(order.platformFee)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Delivery</p>
            <p className="font-medium truncate">{order.deliveryAddress}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Update Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update status for Order #{orderId.toString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value.toString()}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tracking Number</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <Button
                onClick={handleUpdate}
                className="w-full"
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? 'Updating...' : 'Update Order'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function SellersManagement() {
  const [address, setAddress] = useState('')
  const [checkAddress, setCheckAddress] = useState('')

  const { authorizeSeller, isPending: authPending, isConfirming: authConfirming, isSuccess: authSuccess, error: authError } = useAuthorizeSeller()
  const { revokeSeller, isPending: revokePending, isConfirming: revokeConfirming, isSuccess: revokeSuccess, error: revokeError } = useRevokeSeller()
  const { data: isAuthorized, refetch } = useIsAuthorizedSeller(checkAddress as `0x${string}` | undefined)
  const { toast } = useToast()

  useEffect(() => {
    if (authSuccess) {
      toast({
        title: 'Seller Authorized',
        description: 'The seller has been authorized.',
      })
      setAddress('')
      refetch()
    }
  }, [authSuccess, toast, refetch])

  useEffect(() => {
    if (revokeSuccess) {
      toast({
        title: 'Seller Revoked',
        description: 'The seller authorization has been revoked.',
      })
      setAddress('')
      refetch()
    }
  }, [revokeSuccess, toast, refetch])

  useEffect(() => {
    if (authError) {
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
    }
  }, [authError, toast])

  useEffect(() => {
    if (revokeError) {
      toast({
        title: 'Error',
        description: revokeError.message,
        variant: 'destructive',
      })
    }
  }, [revokeError, toast])

  const handleAuthorize = () => {
    if (!address.startsWith('0x') || address.length !== 42) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Ethereum address',
        variant: 'destructive',
      })
      return
    }
    authorizeSeller(address as `0x${string}`)
  }

  const handleRevoke = () => {
    if (!address.startsWith('0x') || address.length !== 42) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Ethereum address',
        variant: 'destructive',
      })
      return
    }
    revokeSeller(address as `0x${string}`)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Sellers
          </CardTitle>
          <CardDescription>
            Authorize or revoke seller permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seller Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAuthorize}
              disabled={authPending || authConfirming}
              className="flex-1"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {authPending || authConfirming ? 'Processing...' : 'Authorize'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokePending || revokeConfirming}
              className="flex-1"
            >
              <ShieldX className="mr-2 h-4 w-4" />
              {revokePending || revokeConfirming ? 'Processing...' : 'Revoke'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check Seller Status</CardTitle>
          <CardDescription>
            Verify if an address is an authorized seller
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Address to Check</Label>
            <Input
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          {checkAddress && checkAddress.length === 42 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-medium">{truncateAddress(checkAddress)}</span> is{' '}
                <Badge variant={isAuthorized ? 'default' : 'secondary'}>
                  {isAuthorized ? 'Authorized' : 'Not Authorized'}
                </Badge>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsManagement() {
  const { data: currentFee } = usePlatformFee()
  const { data: balance } = useContractBalance()
  const [newFee, setNewFee] = useState('')

  const { setPlatformFee, isPending: feePending, isConfirming: feeConfirming, isSuccess: feeSuccess, error: feeError } = useSetPlatformFee()
  const { withdrawFunds, isPending: withdrawPending, isConfirming: withdrawConfirming, isSuccess: withdrawSuccess, error: withdrawError } = useWithdrawFunds()
  const { toast } = useToast()

  useEffect(() => {
    if (currentFee !== undefined) {
      setNewFee(currentFee.toString())
    }
  }, [currentFee])

  useEffect(() => {
    if (feeSuccess) {
      toast({
        title: 'Fee Updated',
        description: 'Platform fee has been updated.',
      })
    }
  }, [feeSuccess, toast])

  useEffect(() => {
    if (withdrawSuccess) {
      toast({
        title: 'Funds Withdrawn',
        description: 'Contract balance has been withdrawn.',
      })
    }
  }, [withdrawSuccess, toast])

  useEffect(() => {
    if (feeError) {
      toast({
        title: 'Error',
        description: feeError.message,
        variant: 'destructive',
      })
    }
  }, [feeError, toast])

  useEffect(() => {
    if (withdrawError) {
      toast({
        title: 'Error',
        description: withdrawError.message,
        variant: 'destructive',
      })
    }
  }, [withdrawError, toast])

  const handleSetFee = () => {
    const fee = parseInt(newFee)
    if (isNaN(fee) || fee < 0 || fee > 10) {
      toast({
        title: 'Error',
        description: 'Fee must be between 0 and 10%',
        variant: 'destructive',
      })
      return
    }
    setPlatformFee(BigInt(fee))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Platform Fee
          </CardTitle>
          <CardDescription>
            Set the platform fee percentage (0-10%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fee Percentage</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={10}
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
              />
              <span className="flex items-center text-muted-foreground">%</span>
            </div>
          </div>
          <Button
            onClick={handleSetFee}
            disabled={feePending || feeConfirming}
            className="w-full"
          >
            {feePending || feeConfirming ? 'Updating...' : 'Update Fee'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdraw Funds
          </CardTitle>
          <CardDescription>
            Withdraw contract balance to owner wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">
              {balance ? formatEther(balance) : '0'} ETH
            </p>
          </div>
          <Button
            onClick={() => withdrawFunds()}
            disabled={withdrawPending || withdrawConfirming || !balance || balance === BigInt(0)}
            className="w-full"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {withdrawPending || withdrawConfirming ? 'Withdrawing...' : 'Withdraw All Funds'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
