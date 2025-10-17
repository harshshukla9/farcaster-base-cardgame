import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/splash.png`,
  button: {
    title: 'Play Base Stack',
    action: {
      type: 'launch_frame',
      name: 'Base Farcaster MiniApp Template',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Base Stack',
    openGraph: {
      title: 'Base Stack',
      description: 'Base Stack - Crypto puzzle game on Base',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
