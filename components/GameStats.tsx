'use client'

import styled from 'styled-components'

const StatsContainer = styled.div`
  padding: 10px 20px;
  color: white;
  width: 100%;
  background: #0b0c1a;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  border-bottom: 3px solid #0052FF;
`

const LivesContainer = styled.div`
  display: flex;
  gap: 2px;
`

const Heart = styled.span<{ active: boolean }>`
  font-size: 28px;
  color: ${props => props.active ? '#b81f24' : '#444'};
`

const TimerContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #0052FF;
  color: white;
  padding: 8px 14px;
  border: 3px solid #0b0c1a;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 2px 2px #0b0c1a;
  box-shadow: 4px 4px 0 #000;
  z-index: 100;
`

const StatItem = styled.div`
  font-weight: bold;
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
