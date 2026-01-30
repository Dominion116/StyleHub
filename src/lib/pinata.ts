import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud"
})

export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    const upload = await pinata.upload.file(file)
    const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${upload.IpfsHash}`
    return url
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload image to IPFS')
  }
}
