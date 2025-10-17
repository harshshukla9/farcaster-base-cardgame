"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

// Get Reown/WalletConnect Project ID from environment or use a default
const projectId = process.env.REOWN_PROJECT_ID || 'demo-project-id'

// Set up Wagmi Adapter with Farcaster connector
const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
  ssr: true,
  connectors: [
    miniAppConnector(), // Add Farcaster Mini App connector
  ],
})

// Create AppKit instance
const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: 'Base Stack Game',
    description: 'Base Stack - Crypto puzzle game on Base!',
    url: 'https://basestack.game',
    icons: ['/images/icon.png']
  },
  features: {
    analytics: true, // Enable analytics
    email: false, // Disable email login
    socials: false, // Disable social logins
    onramp: false, // Disable on-ramp
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0052FF',
    '--w3m-border-radius-master': '16px',
  },
  allWallets: 'SHOW', // Show all available wallets
})

// Export the wagmi config
// This includes:
// - Farcaster Mini App connector (for in-app usage)
// - All wallets supported by Reown AppKit (MetaMask, Coinbase, etc.)
export const config = wagmiAdapter.wagmiConfig

const queryClient = new QueryClient()

export function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
