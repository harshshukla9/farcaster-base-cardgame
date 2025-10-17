'use client'

import styled from 'styled-components'

const StatsContainer = styled.div`
  padding: 12px 20px;
  color: white;
  width: 100%;
  background: #0b0c1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 3px solid #0052FF;
  position: relative;
`

const LivesContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const Heart = styled.span<{ active: boolean }>`
  font-size: 24px;
  color: ${props => props.active ? '#ff4444' : '#444'};
  text-shadow: ${props => props.active ? '0 0 8px rgba(255, 68, 68, 0.6)' : 'none'};
  transition: all 0.2s ease;
`

const TimerContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background: #0052FF;
  color: white;
  padding: 6px 12px;
  border: 3px solid #0b0c1a;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px #0b0c1a;
  box-shadow: 4px 4px 0 #000;
  z-index: 99;
`

const StatItem = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-shadow: 1px 1px #000;
`

interface GameStatsProps {
  lives: number
  level: number
  score: number
  time: number
}

export default function GameStats({ lives, level, score, time }: GameStatsProps) {
  return (
    <>
      <StatsContainer>
        <LivesContainer>
          {[0, 1, 2].map((index) => (
            <Heart key={index} active={index < lives}>♥</Heart>
          ))}
        </LivesContainer>
        <StatItem>Level: <span>{level}</span></StatItem>
        <StatItem>Score: <span>{score}</span></StatItem>
      </StatsContainer>
      <TimerContainer>
        <div><span>{time}</span></div>
      </TimerContainer>
    </>
  )
}
