'use client'

import React, { useState } from 'react'
import { useFrame } from '@/components/farcaster-provider'
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

const SharePreview = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #333;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: white;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  text-align: left;
  font-size: 14px;
  line-height: 1.4;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? '#6b7280' : '#0052FF'};
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

  &:hover {
    background: ${props => props.variant === 'secondary' ? '#4b5563' : '#0066FF'};
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

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #0052FF;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 14px;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  width: 100%;
  height: 100px;
  resize: vertical;
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

interface ScoreShareProps {
  score: number
  level: number
  time: number
  onClose: () => void
}

export default function ScoreShare({ score, level, time, onClose }: ScoreShareProps) {
  const { context, actions } = useFrame()
  const [isSharing, setIsSharing] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const defaultMessage = `🎮 Just scored ${score} points on Base Stack! 
🏆 Reached level ${level} in ${time} seconds
🚀 Can you beat my score? Play now!`

  const shareMessage = customMessage.trim() || defaultMessage

  const handleShare = async () => {
    if (!actions?.composeCast) {
      alert('Cast sharing not available in this environment')
      return
    }

    setIsSharing(true)
    try {
      await actions.composeCast({
        text: shareMessage,
        embeds: [window.location.origin]
      })
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to share cast:', error)
      alert('Failed to share cast. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  if (isSuccess) {
    return (
      <ModalOverlay>
        <ModalContent>
          <Title>🎉 Cast Shared!</Title>
          <div style={{ color: '#10b981', marginBottom: '20px' }}>
            Your score has been shared on Farcaster!
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </ModalContent>
      </ModalOverlay>
    )
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Share Your Score</Title>
        
        <ScoreDisplay>
          Score: {score} | Level: {level} | Time: {time}s
        </ScoreDisplay>

        <SharePreview>
          <strong>Preview:</strong>
          <br />
          {shareMessage}
        </SharePreview>

        <TextArea
          placeholder="Customize your message (optional)"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          maxLength={280}
        />

        <div style={{ marginTop: '20px' }}>
          <Button 
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share Cast'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )
}
