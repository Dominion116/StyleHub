# StyleHub - Decentralized Fashion Marketplace

A Next.js frontend for the StyleHub smart contract deployed on Base mainnet.

## Features

- 🛍️ **Shop** - Browse and purchase fashion items
- 📦 **Orders** - Track your orders and cancel if needed
- 🏪 **Seller Dashboard** - List and manage products (for authorized sellers)
- ⚙️ **Admin Panel** - Manage sellers, orders, fees, and withdrawals (owner only)

## Tech Stack

- **Next.js 14** - React framework
- **shadcn/ui** - UI components
- **wagmi v2** - Ethereum interactions
- **viem** - TypeScript Ethereum library
- **TailwindCSS** - Styling

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Update `.env.local`:
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed StyleHub contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get one at [WalletConnect Cloud](https://cloud.walletconnect.com)

### 3. Update Contract Address

Update the contract address in `src/lib/contract.ts`:

```typescript
export const STYLEHUB_ADDRESS = "0xYOUR_CONTRACT_ADDRESS" as `0x${string}`
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` - Home page with product listings
- `/product/[id]` - Product detail and purchase page
- `/orders` - View and manage your orders
- `/seller` - Seller dashboard (authorized sellers only)
- `/admin` - Admin panel (contract owner only)

## Contract Integration

The frontend integrates with the StyleHub contract through custom hooks in `src/hooks/useContract.ts`:

### Read Functions
- `useProductCount()` - Get total products
- `useProduct(id)` - Get product details
- `useOrderCount()` - Get total orders
- `useOrder(id)` - Get order details
- `useCustomerOrders(address)` - Get customer's orders
- `useIsAuthorizedSeller(address)` - Check seller authorization
- `useContractOwner()` - Get contract owner
- `usePlatformFee()` - Get platform fee percentage
- `useContractBalance()` - Get contract ETH balance

### Write Functions
- `useListProduct()` - List a new product
- `useModifyProduct()` - Update product details
- `useCreateOrder()` - Place an order
- `useCancelOrder()` - Cancel an order
- `useUpdateOrderStatus()` - Update order status (owner)
- `useAuthorizeSeller()` - Authorize a seller (owner)
- `useRevokeSeller()` - Revoke seller (owner)
- `useSetPlatformFee()` - Set platform fee (owner)
- `useWithdrawFunds()` - Withdraw contract balance (owner)

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npx vercel
```

## License

MIT
