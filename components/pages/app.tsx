'use client'
import CryptoPuzzle from '../Home'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'


export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()

  // Allow the app to work without Farcaster SDK for testing
  // In production, it will still work better with the SDK
  const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined'

  if (isLoading && !isDevelopment) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center">Loading...</h1>
        </div>
      </SafeAreaContainer>
    )
  }

  // Show the game regardless of SDK status - the SDK features are optional
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <CryptoPuzzle />
    </div>
  )
}
