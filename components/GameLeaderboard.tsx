'use client'

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { base } from 'wagmi/chains'
import contractConfig from '@/lib/contract'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`

const ModalContent = styled.div`
  background: #0b0c1a;
  border: 3px solid #0052FF;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 82, 255, 0.3);
`

const Title = styled.h2`
  color: #0052FF;
  font-family: "Venite Adoremus", "Bangers", cursive;
  font-size: 28px;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px #000;
  text-align: center;
`

const Button = styled.button`
  background: #0052FF;
  color: white;
  border: 3px solid #0b0c1a;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  text-shadow: 2px 2px #0b0c1a;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s ease;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  margin: 8px;

  &:hover {
    background: #0066FF;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }
`

const LeaderboardEntry = styled.div<{ rank: number }>`
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  background: ${props => {
    switch (props.rank) {
      case 1: return 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2))'
      case 2: return 'linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.2))'
      case 3: return 'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 115, 51, 0.2))'
      default: return 'rgba(255, 255, 255, 0.05)'
    }
  }};
  border: 2px solid ${props => {
    switch (props.rank) {
      case 1: return '#FFD700'
      case 2: return '#C0C0C0'
      case 3: return '#CD7F32'
      default: return '#333'
    }
  }};
  border-radius: 12px;
  color: white;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const Rank = styled.div<{ rank: number }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  background: ${props => {
    switch (props.rank) {
      case 1: return '#FFD700'
      case 2: return '#C0C0C0'
      case 3: return '#CD7F32'
      default: return '#0052FF'
    }
  }};
  color: ${props => props.rank <= 3 ? '#000' : '#fff'};
  font-size: 14px;
`

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #0052FF;
`

const Username = styled.div`
  font-weight: bold;
  font-size: 14px;
`

const Score = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #0052FF;
`

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #0052FF;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 20px;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

interface LeaderboardEntry {
  user: string
  username: string
  fid: bigint
  pfp: string
  score: bigint
}

interface GameLeaderboardProps {
  onClose: () => void
}

export default function GameLeaderboard({ onClose }: GameLeaderboardProps) {
  const { address } = useAccount()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🔍 GameLeaderboard mounted, fetching leaderboard...")
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      })

      const contractAddress = contractConfig.contractAddress as `0x${string}`
      const abi = contractConfig.abi

      const scores = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: 'getAllScoresDescending',
        args: [],
      }) as any[]

      const normalized: LeaderboardEntry[] = (scores || []).map((d: any) => ({
        user: d.user as string,
        username: d.username as string,
        fid: d.fid as bigint,
        pfp: d.pfp as string,
        score: d.score as bigint,
      }))

      setLeaderboard(normalized.slice(0, 20)) // Show top 20
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>🏆 Leaderboard</Title>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage>
            {error}
            <br />
            <Button onClick={fetchLeaderboard} style={{ marginTop: '10px' }}>
              Retry
            </Button>
          </ErrorMessage>
        ) : (
          <div>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
                No scores yet! Be the first to submit a score.
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <LeaderboardEntry key={entry.user} rank={index + 1}>
                  <Rank rank={index + 1}>
                    {index + 1}
                  </Rank>
                  <PlayerInfo>
                    {entry.pfp && (
                      <Avatar 
                        src={entry.pfp} 
                        alt={entry.username}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div>
                      <Username>{entry.username || 'Anonymous'}</Username>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {entry.user.slice(0, 6)}...{entry.user.slice(-4)}
                      </div>
                    </div>
                  </PlayerInfo>
                  <Score>{entry.score.toString()}</Score>
                </LeaderboardEntry>
              ))
            )}
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button onClick={fetchLeaderboard}>
            Refresh
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )
}
