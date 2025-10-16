import { createConfig, http } from 'wagmi'
import { arbitrum, base, mainnet, polygon, optimism, sepolia } from 'viem/chains'
import { QueryClient } from '@tanstack/react-query'

// Simple wagmi config without AppKit for basic functionality
export const wagmiConfig = createConfig({
  chains: [base, mainnet, arbitrum, polygon, optimism, sepolia],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
})

// Create a client
const queryClient = new QueryClient()

export { queryClient }
