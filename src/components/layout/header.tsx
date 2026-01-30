'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
import { useContractOwner, useIsAuthorizedSeller } from '@/hooks/useContract'
import { ShoppingBag, Package, Settings, Store, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: owner } = useContractOwner()
  const { data: isAuthorizedSeller } = useIsAuthorizedSeller(address)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()
  const canSell = isOwner || isAuthorizedSeller

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Store className="h-6 w-6" />
            <span className="text-xl font-bold">StyleHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Shop
            </Link>
            {isConnected && (
              <Link href="/orders" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Package className="h-4 w-4" />
                My Orders
              </Link>
            )}
            {canSell && (
              <Link href="/seller" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                Seller Dashboard
              </Link>
            )}
            {isOwner && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {truncateAddress(address!)}
                </span>
                <Button variant="outline" size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                size="sm"
              >
                Connect Wallet
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            {isConnected && (
              <Link
                href="/orders"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
            {canSell && (
              <Link
                href="/seller"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}
            {isOwner && (
              <Link
                href="/admin"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
