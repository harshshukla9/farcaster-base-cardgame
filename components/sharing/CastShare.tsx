'use client'

import React, { useState } from 'react'
import { useFrame } from '../farcaster-provider'

interface CastShareProps {
  type: 'score' | 'tokenClaims'
  rank?: number
  score?: number
  username?: string
  totalClaims?: number
  tokenAmounts?: {
    arb: string
    pepe: string
    boop: string
  }
  onClose?: () => void
}

export default function CastShare({ 
  type, 
  rank, 
  score, 
  username, 
  totalClaims, 
  tokenAmounts,
  onClose 
}: CastShareProps) {
  const { actions, context } = useFrame()
  const [isSharing, setIsSharing] = useState(false)
  const [customMessage, setCustomMessage] = useState('')

  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount)
    if (num === 0) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(4)
  }

  const generateCastText = () => {
    if (type === 'score') {
      return `🏆 Just scored ${score} points in Flapbitrum and ranked #${rank}! 

Can you beat my score? 🚀

Play now: ${window.location.origin}

#Flapbitrum #Gaming #Arbitrum #Farcaster`
    } else {
      const tokensText = []
      if (tokenAmounts?.arb && parseFloat(tokenAmounts.arb) > 0) {
        tokensText.push(`${formatTokenAmount(tokenAmounts.arb)} ARB`)
      }
      if (tokenAmounts?.pepe && parseFloat(tokenAmounts.pepe) > 0) {
        tokensText.push(`${formatTokenAmount(tokenAmounts.pepe)} PEPE`)
      }
      if (tokenAmounts?.boop && parseFloat(tokenAmounts.boop) > 0) {
        tokensText.push(`${formatTokenAmount(tokenAmounts.boop)} BOOP`)
      }

      return `💰 Just claimed ${totalClaims} token rewards in Flapbitrum! 

Tokens claimed: ${tokensText.join(', ')}

Ranked #${rank} on the token claims leaderboard! 🎯



#Flapbitrum #TokenRewards #Arbitrum #Farcaster`
    }
  }

  const handleCast = async () => {
    if (!actions?.composeCast) {
      alert('Cast functionality not available')
      return
    }

    setIsSharing(true)
    
    try {
      const castText = customMessage || generateCastText()
      
      await actions.composeCast({
        text: castText,
        embeds: [window.location.origin]
      })
      
      console.log('✅ Cast shared successfully!')
      onClose?.()
      
    } catch (error) {
      console.error('❌ Failed to share cast:', error)
      alert('Failed to share cast. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const getRankEmoji = (rank?: number) => {
    if (!rank) return '🏆'
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getTypeEmoji = () => {
    return type === 'score' ? '🏆' : '💰'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">{getTypeEmoji()}</span>
            Share Your {type === 'score' ? 'Score' : 'Token Claims'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              type === 'score' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900'
                : 'bg-gradient-to-r from-green-400 to-emerald-500 text-green-900'
            }`}>
              {getRankEmoji(rank)}
            </div>
            <div>
              <div className="text-white font-bold">
                {username || 'You'}
              </div>
              <div className="text-gray-300 text-sm">
                {type === 'score' 
                  ? `Score: ${score} points`
                  : `${totalClaims} token claims`
                }
              </div>
            </div>
          </div>

          {/* Token amounts for claims */}
          {type === 'tokenClaims' && tokenAmounts && (
            <div className="flex space-x-2 mb-3">
              {parseFloat(tokenAmounts.arb) > 0 && (
                <div className="bg-blue-600/30 rounded-lg px-3 py-2 text-center">
                  <div className="text-blue-300 font-bold text-sm">{formatTokenAmount(tokenAmounts.arb)}</div>
                  <div className="text-blue-200 text-xs">ARB</div>
                </div>
              )}
              {parseFloat(tokenAmounts.pepe) > 0 && (
                <div className="bg-green-600/30 rounded-lg px-3 py-2 text-center">
                  <div className="text-green-300 font-bold text-sm">{formatTokenAmount(tokenAmounts.pepe)}</div>
                  <div className="text-green-200 text-xs">PEPE</div>
                </div>
              )}
              {parseFloat(tokenAmounts.boop) > 0 && (
                <div className="bg-purple-600/30 rounded-lg px-3 py-2 text-center">
                  <div className="text-purple-300 font-bold text-sm">{formatTokenAmount(tokenAmounts.boop)}</div>
                  <div className="text-purple-200 text-xs">BOOP</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cast Preview */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Cast Preview:
          </label>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {customMessage || generateCastText()}
            </p>
          </div>
        </div>

        {/* Custom Message Input */}
        {/* <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Customize your message (optional):
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your own message..."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
            rows={3}
            maxLength={280}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {customMessage.length}/280 characters
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCast}
            disabled={isSharing}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sharing...
              </>
            ) : (
              <>
                <span className="mr-2">📢</span>
                Share Cast
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            💡 Share your progress to motivate others and grow the Flapbitrum community!
          </p>
        </div>
      </div>
    </div>
  )
}
