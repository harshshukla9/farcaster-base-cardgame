'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useFrame } from '@/components/farcaster-provider'
import { useContractScore } from '@/hooks/useContractScore'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`

const ModalContent = styled.div`
  background: #0b0c1a;
  border: 3px solid #0052FF;
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 30px rgba(0, 82, 255, 0.3);
`

const Title = styled.h2`
  color: #0052FF;
  font-family: "Venite Adoremus", "Bangers", cursive;
  font-size: 28px;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px #000;
`

const ScoreDisplay = styled.div`
  background: rgba(0, 82, 255, 0.2);
  border: 2px solid #0052FF;
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#10b981'
      case 'secondary': return '#6b7280'
      default: return '#0052FF'
    }
  }};
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
  min-width: 120px;

  &:hover:not(:disabled) {
    background: ${props => {
      switch (props.variant) {
        case 'success': return '#059669'
        case 'secondary': return '#4b5563'
        default: return '#0066FF'
      }
    }};
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:disabled {
    background: #374151;
    cursor: not-allowed;
    transform: none;
    box-shadow: 2px 2px 0 #000;
  }
`

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #0052FF;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 16px;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  width: 100%;
  margin: 10px 0;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #0066FF;
    box-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin: 10px 0;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin: 10px 0;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #0052FF;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

interface ScoreSubmissionProps {
  score: number
  level: number
  time: number
  onClose: () => void
  onViewLeaderboard?: () => void
  onShare?: () => void
}

export default function ScoreSubmission({
  score,
  level,
  time,
  onClose,
  onViewLeaderboard,
  onShare
}: ScoreSubmissionProps) {
  const { address, isConnected } = useAccount()
  const { context } = useFrame()
  const { saveScoreToContractWithMongo, isSubmitting, isSuccess, isError, error, txHash, reset } = useContractScore()
  const [username, setUsername] = useState('')
  const [fid, setFid] = useState('')
  const [pfp, setPfp] = useState('')

  const handleSubmit = async () => {
    if (!isConnected || !address || score <= 0) {
      console.log("🔍 Cannot save score - conditions not met")
      return
    }

    // Get Farcaster user data from context
    const farcasterUsername = context?.user?.username || username.trim() || "Anonymous"
    const farcasterFid = context?.user?.fid || parseInt(fid) || 0
    const farcasterPfp = context?.user?.pfpUrl || pfp.trim() || ""
    
    console.log("🔍 Farcaster data - Username:", farcasterUsername, "FID:", farcasterFid, "PFP:", farcasterPfp)
    console.log("🔍 User requested to save score to smart contract and MongoDB:", score)
    
    // Use the enhanced hook that automatically syncs to MongoDB
    await saveScoreToContractWithMongo(score, farcasterUsername, farcasterFid, farcasterPfp)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleViewLeaderboard = () => {
    onViewLeaderboard?.()
  }

  const handleShare = () => {
    onShare?.()
  }

  if (isSuccess) {
    return (
      <ModalOverlay>
        <ModalContent>
          <Title>🎉 Score Submitted!</Title>
          <SuccessMessage>
            Your score has been recorded on-chain!
          </SuccessMessage>
          {txHash && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <Button onClick={handleViewLeaderboard}>
              View Leaderboard
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    )
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Submit Score</Title>
        
        <ScoreDisplay>
          Score: {score} | Level: {level} | Time: {time}s
        </ScoreDisplay>

        {!address ? (
          <div>
            <p style={{ color: '#ef4444', marginBottom: '20px' }}>
              Please connect your wallet to submit your score
            </p>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div>
            {context?.user?.username && (
              <div style={{ 
                background: 'rgba(0, 82, 255, 0.2)', 
                border: '2px solid #0052FF', 
                borderRadius: '8px', 
                padding: '12px', 
                marginBottom: '15px',
                color: 'white',
                fontSize: '14px'
              }}>
                <strong>Farcaster User:</strong> {context.user.username}
                {context.user.fid && <><br /><strong>FID:</strong> {context.user.fid}</>}
              </div>
            )}
            
            <Input
              type="text"
              placeholder={context?.user?.username ? "Override username (optional)" : "Enter your username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={50}
            />
            
            <Input
              type="number"
              placeholder="Farcaster ID (optional)"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
            />
            
            <Input
              type="url"
              placeholder="Profile picture URL (optional)"
              value={pfp}
              onChange={(e) => setPfp(e.target.value)}
            />

            {isError && error && (
              <ErrorMessage>{error}</ErrorMessage>
            )}

            <div style={{ marginTop: '20px' }}>
              {isSubmitting ? (
                <div>
                  <LoadingSpinner />
                  <p style={{ color: 'white', margin: '10px 0' }}>
                    Submitting to blockchain...
                  </p>
                  <Button disabled>Submitting...</Button>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!(username.trim() || context?.user?.username)}
                  >
                    Submit Score
                  </Button>
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
          <Button onClick={handleViewLeaderboard}>
            View Leaderboard
          </Button>
          <Button onClick={handleShare}>
            Share Score
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )
}
