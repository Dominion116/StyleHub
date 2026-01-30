'use client'

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { STYLEHUB_ABI, STYLEHUB_ADDRESS } from '@/lib/contract'
import { parseEther } from 'viem'

export interface Product {
  id: bigint
  name: string
  description: string
  category: number
  priceInWei: bigint
  stockQuantity: bigint
  imageURI: string
  seller: `0x${string}`
  isActive: boolean
  totalSales: bigint
  createdAt: bigint
}

export interface Order {
  id: bigint
  customer: `0x${string}`
  productId: bigint
  quantity: bigint
  totalAmount: bigint
  platformFee: bigint
  status: number
  placedAt: bigint
  updatedAt: bigint
  deliveryAddress: string
  trackingNumber: string
}

// Read hooks
export function useProductCount() {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getProductCount',
  })
}

export function useProduct(productId: bigint) {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getProduct',
    args: [productId],
  })
}

export function useOrderCount() {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getOrderCount',
  })
}

export function useOrder(orderId: bigint) {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getOrder',
    args: [orderId],
  })
}

export function useCustomerOrders(customer: `0x${string}` | undefined) {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getCustomerOrders',
    args: customer ? [customer] : undefined,
    query: {
      enabled: !!customer,
    },
  })
}

export function useIsAuthorizedSeller(seller: `0x${string}` | undefined) {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'isAuthorizedSeller',
    args: seller ? [seller] : undefined,
    query: {
      enabled: !!seller,
    },
  })
}

export function useContractOwner() {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getOwner',
  })
}

export function usePlatformFee() {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getPlatformFee',
  })
}

export function useContractBalance() {
  return useReadContract({
    address: STYLEHUB_ADDRESS,
    abi: STYLEHUB_ABI,
    functionName: 'getContractBalance',
  })
}

// Write hooks
export function useListProduct() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const listProduct = (
    name: string,
    description: string,
    category: number,
    priceInWei: bigint,
    stockQuantity: bigint,
    imageURI: string
  ) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'listProduct',
      args: [name, description, category, priceInWei, stockQuantity, imageURI],
    })
  }

  return { listProduct, isPending, isConfirming, isSuccess, error, hash }
}

export function useModifyProduct() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const modifyProduct = (
    productId: bigint,
    priceInWei: bigint,
    stockQuantity: bigint,
    isActive: boolean
  ) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'modifyProduct',
      args: [productId, priceInWei, stockQuantity, isActive],
    })
  }

  return { modifyProduct, isPending, isConfirming, isSuccess, error, hash }
}

export function useCreateOrder() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createOrder = (
    productId: bigint,
    quantity: bigint,
    deliveryAddress: string,
    totalValue: bigint
  ) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'createOrder',
      args: [productId, quantity, deliveryAddress],
      value: totalValue,
    })
  }

  return { createOrder, isPending, isConfirming, isSuccess, error, hash }
}

export function useCancelOrder() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const cancelOrder = (orderId: bigint) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'cancelOrder',
      args: [orderId],
    })
  }

  return { cancelOrder, isPending, isConfirming, isSuccess, error, hash }
}

export function useUpdateOrderStatus() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const updateOrderStatus = (
    orderId: bigint,
    newStatus: number,
    trackingNumber: string
  ) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'updateOrderStatus',
      args: [orderId, newStatus, trackingNumber],
    })
  }

  return { updateOrderStatus, isPending, isConfirming, isSuccess, error, hash }
}

export function useAuthorizeSeller() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const authorizeSeller = (seller: `0x${string}`) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'authorizeSeller',
      args: [seller],
    })
  }

  return { authorizeSeller, isPending, isConfirming, isSuccess, error, hash }
}

export function useRevokeSeller() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const revokeSeller = (seller: `0x${string}`) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'revokeSeller',
      args: [seller],
    })
  }

  return { revokeSeller, isPending, isConfirming, isSuccess, error, hash }
}

export function useSetPlatformFee() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const setPlatformFee = (feePercent: bigint) => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'setPlatformFee',
      args: [feePercent],
    })
  }

  return { setPlatformFee, isPending, isConfirming, isSuccess, error, hash }
}

export function useWithdrawFunds() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const withdrawFunds = () => {
    writeContract({
      address: STYLEHUB_ADDRESS,
      abi: STYLEHUB_ABI,
      functionName: 'withdrawFunds',
    })
  }

  return { withdrawFunds, isPending, isConfirming, isSuccess, error, hash }
}
