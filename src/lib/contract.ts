export const STYLEHUB_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "InsufficientStock", type: "error" },
  { inputs: [], name: "InvalidAddress", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidPayment", type: "error" },
  { inputs: [], name: "InvalidProduct", type: "error" },
  { inputs: [], name: "OrderNotCancellable", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  { inputs: [], name: "Unauthorized", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "FundsWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "orderId", type: "uint256" },
      { indexed: true, internalType: "address", name: "customer", type: "address" },
      { indexed: true, internalType: "uint256", name: "productId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "quantity", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalAmount", type: "uint256" }
    ],
    name: "OrderCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "orderId", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "previousStatus", type: "uint8" },
      { indexed: false, internalType: "uint8", name: "newStatus", type: "uint8" }
    ],
    name: "OrderStatusChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "productId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "uint8", name: "category", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: true, internalType: "address", name: "seller", type: "address" }
    ],
    name: "ProductListed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "productId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newPrice", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newStock", type: "uint256" },
      { indexed: false, internalType: "bool", name: "isActive", type: "bool" }
    ],
    name: "ProductModified",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "seller", type: "address" }],
    name: "SellerAuthorized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "seller", type: "address" }],
    name: "SellerRevoked",
    type: "event"
  },
  {
    inputs: [],
    name: "MARKETPLACE_NAME",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_seller", type: "address" }],
    name: "authorizeSeller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_orderId", type: "uint256" }],
    name: "cancelOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_productId", type: "uint256" },
      { internalType: "uint256", name: "_quantity", type: "uint256" },
      { internalType: "string", name: "_deliveryAddress", type: "string" }
    ],
    name: "createOrder",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_customer", type: "address" }],
    name: "getCustomerOrders",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_orderId", type: "uint256" }],
    name: "getOrder",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "customer", type: "address" },
          { internalType: "uint256", name: "productId", type: "uint256" },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "uint256", name: "totalAmount", type: "uint256" },
          { internalType: "uint256", name: "platformFee", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "placedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "string", name: "deliveryAddress", type: "string" },
          { internalType: "string", name: "trackingNumber", type: "string" }
        ],
        internalType: "struct StyleHub.Order",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getOrderCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getPlatformFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_productId", type: "uint256" }],
    name: "getProduct",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint8", name: "category", type: "uint8" },
          { internalType: "uint256", name: "priceInWei", type: "uint256" },
          { internalType: "uint256", name: "stockQuantity", type: "uint256" },
          { internalType: "string", name: "imageURI", type: "string" },
          { internalType: "address", name: "seller", type: "address" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "totalSales", type: "uint256" },
          { internalType: "uint256", name: "createdAt", type: "uint256" }
        ],
        internalType: "struct StyleHub.Product",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getProductCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_seller", type: "address" }],
    name: "isAuthorizedSeller",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint8", name: "_category", type: "uint8" },
      { internalType: "uint256", name: "_priceInWei", type: "uint256" },
      { internalType: "uint256", name: "_stockQuantity", type: "uint256" },
      { internalType: "string", name: "_imageURI", type: "string" }
    ],
    name: "listProduct",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_productId", type: "uint256" },
      { internalType: "uint256", name: "_priceInWei", type: "uint256" },
      { internalType: "uint256", name: "_stockQuantity", type: "uint256" },
      { internalType: "bool", name: "_isActive", type: "bool" }
    ],
    name: "modifyProduct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_seller", type: "address" }],
    name: "revokeSeller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_feePercent", type: "uint256" }],
    name: "setPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_orderId", type: "uint256" },
      { internalType: "uint8", name: "_newStatus", type: "uint8" },
      { internalType: "string", name: "_trackingNumber", type: "string" }
    ],
    name: "updateOrderStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
] as const

// Replace with your deployed contract address on Base mainnet
export const STYLEHUB_ADDRESS = "0xDbf0f29d17d0Ea65ec1fc0B19D1Ef45c6C788396" as `0x${string}`

export const CATEGORIES = [
  { value: 0, label: "Tops" },
  { value: 1, label: "Bottoms" },
  { value: 2, label: "Footwear" },
  { value: 3, label: "Accessories" }
] as const

export const ORDER_STATUSES = [
  { value: 0, label: "Placed" },
  { value: 1, label: "Confirmed" },
  { value: 2, label: "Shipped" },
  { value: 3, label: "Delivered" },
  { value: 4, label: "Cancelled" },
  { value: 5, label: "Refunded" }
] as const
