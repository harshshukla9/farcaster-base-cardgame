'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'
import contractConfig from '@/lib/contract'
import Link from 'next/link'
import CastShare from '../sharing/CastShare'

interface ScoreLeaderboardEntry {
  user: string
  username: string
  fid: bigint
  pfp: string
  score: bigint
}

export default function Leaderboard() {
  const { address } = useAccount()
  const [scoreEntries, setScoreEntries] = useState<ScoreLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [myScorePosition, setMyScorePosition] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareData, setShareData] = useState<any>(null)

  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  })

  const contractAddress = contractConfig.contractAddress as `0x${string}`
  const abi = contractConfig.abi

  // Load score leaderboard
  const loadScoreLeaderboard = useMemo(
    () => async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = (await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'getTopScores',
          args: [BigInt(100)],
        })) as any[]

        const normalized: ScoreLeaderboardEntry[] = (data || []).map((d: any) => ({
          user: d.user as string,
          username: (d.username as string) || '',
          fid: BigInt(d.fid ?? 0),
          pfp: (d.pfp as string) || '',
          score: BigInt(d.score ?? 0),
        }))

        setScoreEntries(normalized)

        if (address) {
          const myEntry = normalized.find(
            (entry: ScoreLeaderboardEntry) => entry.user.toLowerCase() === address.toLowerCase()
          )
          setMyScorePosition(myEntry || null)
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load score leaderboard')
      } finally {
        setIsLoading(false)
      }
    },
    [contractAddress, abi, address]
  )

  useEffect(() => {
    loadScoreLeaderboard()
  }, [loadScoreLeaderboard])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getScoreColor = (scoreNumber: number) => {
    if (scoreNumber >= 100) return 'text-green-400'
    if (scoreNumber >= 50) return 'text-yellow-400'
    if (scoreNumber >= 20) return 'text-orange-400'
    return 'text-gray-400'
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const getDisplayName = (entry: any) => {
    return entry.username || formatAddress(entry.userAddress || entry.user)
  }

  const handleShareScore = () => {
    if (!myScorePosition) return
    
    const rank = scoreEntries.findIndex(entry => entry.user.toLowerCase() === address?.toLowerCase()) + 1
    
    setShareData({
      type: 'score',
      rank,
      score: Number(myScorePosition.score),
      username: myScorePosition.username
    })
    setShowShareModal(true)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center max-w-sm w-full">
          <div className="text-red-400 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-3">Error</h2>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={loadScoreLeaderboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-full"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pb-6">
      <div className="max-w-2xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
            >
              ← Home
            </Link>
            <h1 className="text-xl font-bold text-white">
              🏆 Leaderboard
            </h1>
            <div className="w-20"></div>
          </div>
          
          {/* Action Button */}
          <div className="flex gap-2">
            <button
              onClick={loadScoreLeaderboard}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {isLoading ? 'Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* My Position Card */}
        {address && (
          <div className="mb-4">
            <h2 className="text-base font-bold text-white mb-2 flex items-center px-1">
              <span className="mr-2">👤</span>
              My Position
            </h2>
            {myScorePosition ? (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-400/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      {myScorePosition.pfp ? (
                        <img
                          src={myScorePosition.pfp}
                          alt={getDisplayName(myScorePosition)}
                          className="w-12 h-12 rounded-full border-2 border-yellow-400/50 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {getDisplayName(myScorePosition).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-bold text-sm truncate">
                        {getDisplayName(myScorePosition)}
                      </div>
                      <div className="text-yellow-300 text-xs font-mono">
                        {formatAddress(myScorePosition.user)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-yellow-400 font-bold text-lg">{Number(myScorePosition.score)}</div>
                    <div className="text-gray-300 text-xs">score</div>
                  </div>
                </div>
                <button
                  onClick={handleShareScore}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center text-sm"
                >
                  <span className="mr-2">📢</span>
                  Share My Score
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-white font-semibold text-sm mb-1">No Score Yet</div>
                <div className="text-gray-300 text-xs">Play to rank!</div>
              </div>
            )}
          </div>
        )}

        {/* Main Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <h2 className="text-base font-bold text-white mb-3 flex items-center">
            <span className="mr-2">🏆</span>
            Top Scorers
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
          ) : scoreEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold text-white mb-2">No Scores Yet</h3>
              <p className="text-gray-300 text-sm">Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scoreEntries
                .filter((entry) => Number(entry.score) !== 0)
                .map((entry, index) => {
                  const rank = index + 1
                  const scoreNumber = Number(entry.score)
                  const isInRewardPool = rank <= 30

                  return (
                    <div
                      key={`${entry.user}-${index}`}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isInRewardPool ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          {entry.pfp ? (
                            <div className="relative w-10 h-10">
                              <img
                                src={entry.pfp}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                {rank <= 3 ? getRankIcon(rank).slice(0, 2) : rank}
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-10 h-10">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center border-2 border-white/20">
                                <span className="text-white text-sm font-bold">
                                  {(entry.username || formatAddress(entry.user)).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                {rank}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-sm truncate">
                            {entry.username || formatAddress(entry.user)}
                            {isInRewardPool && <span className="ml-1 text-yellow-400">💰</span>}
                          </div>
                          <div className="text-xs text-gray-400">
                            Rank #{rank}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xl font-bold flex-shrink-0 ml-2 ${getScoreColor(scoreNumber)}`}>
                        {scoreNumber}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>

      {/* Cast Share Modal */}
      {showShareModal && shareData && (
        <CastShare
          type={shareData.type}
          rank={shareData.rank}
          score={shareData.score}
          username={shareData.username}
          onClose={() => {
            setShowShareModal(false)
            setShareData(null)
          }}
        />
      )}
    </div>
  )
}