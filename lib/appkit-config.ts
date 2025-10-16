import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, base, mainnet, polygon, optimism, sepolia } from 'viem/chains'
import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'demo-project-id'

// For development, we'll use a demo project ID if none is provided
const isDevelopment = process.env.NODE_ENV === 'development'

// Create a metadata object - this will be used by the wallet provider
export const metadata = {
  name: 'Base Stack Game',
  description: 'Crypto puzzle game on Base',
  url: 'https://basestack.game', // origin must match your domain & subdomain
  icons: ['/images/icon.png']
}

// Create wagmi config
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

// Create the AppKit with error handling
export const appKit = createAppKit({
  adapters: [WagmiAdapter(wagmiConfig)],
  projectId: isDevelopment && projectId === 'demo-project-id' ? 'demo-project-id' : projectId,
  metadata,
  enableAnalytics: true,
  enableOnramp: true,
})

// Create a client
const queryClient = new QueryClient()

export { queryClient }
