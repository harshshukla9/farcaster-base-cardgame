'use client'

import styled from 'styled-components'
import { Tile } from '../types/game'

const CollectedContainer = styled.div`
  width: 90%;
  max-width: 400px;
  height: 84px;
  background: #0b0c1a;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 0.1rem;
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  border: 3px solid #0052FF;
  border-radius: 12px;
  box-shadow: 0 0 15px #000;
`

const CollectedTile = styled.div<{ index: number; containerWidth: number; isAnimating: boolean }>`
  width: calc((100% - 20px) / 5);
  height: 70px;
  background: #f5f5e1;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition: transform 0.5s ease-in-out, left 0.5s ease-in-out;
  box-shadow: 4px 4px 0 #000;
  left: ${props => (props.index * (props.containerWidth - 20)) / 5}px;
  animation: ${props => props.isAnimating ? 'trio-match 0.8s forwards' : 'none'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 3px solid #000;
  }
`

interface CollectedCardsProps {
  collectedTiles: Tile[]
  animatingTiles: number[]
}

export default function CollectedCards({ collectedTiles, animatingTiles }: CollectedCardsProps) {
  return (
    <CollectedContainer>
      {collectedTiles.map((tile, index) => (
        <CollectedTile 
          key={tile.id} 
          index={index}
          containerWidth={320} // This should be dynamic based on actual container width
          isAnimating={animatingTiles.includes(tile.id)}
        >
          <img src={tile.imageUrl} alt="Card" />
        </CollectedTile>
      ))}
    </CollectedContainer>
  )
}
