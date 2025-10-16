'use client'

import styled from 'styled-components'
import { Tile } from '../types/game'

const GameCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

const TileElement = styled.div<{ 
  x: number; 
  y: number; 
  z: number; 
  xSpacing: number; 
  ySpacing: number; 
  offsetX: number; 
  offsetY: number; 
  layerOffset: number;
  isFree: boolean;
}>`
  position: absolute;
  width: 55px;
  height: 70px;
  background: ${props => props.isFree ? '#ffffff' : '#f0f0f0'};
  border: 2px solid ${props => props.isFree ? '#000000' : '#999999'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.isFree ? 'pointer' : 'default'};
  transform-style: preserve-3d;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  user-select: none;
  opacity: ${props => props.isFree ? '1' : '0.6'};
  left: ${props => props.x * props.xSpacing + props.offsetX}px;
  top: ${props => props.y * props.ySpacing + props.offsetY + props.z * props.layerOffset}px;
  transform: translateZ(${props => props.z * props.layerOffset}px);
  z-index: ${props => 100 + props.z};
  transition: all 0.2s ease;

  &:hover {
    ${props => props.isFree && `
      transform: translateY(-3px) scale(1.1) translateZ(${props.z * props.layerOffset}px);
      border-color: #0052FF;
      background: #fff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(184, 31, 36, 0.3);
    `}
  }

  img {
    width: 92%;
    height: 92%;
    object-fit: cover;
    border: none;
    border-radius: 3px;
    pointer-events: none;
    user-select: none;
  }
`

interface GameBoardProps {
  tiles: Tile[]
  onTileClick: (tile: Tile) => void
}

export default function GameBoard({ tiles, onTileClick }: GameBoardProps) {
  return (
    <GameCanvas>
      {tiles.map((tile) => (
        <TileElement
          key={tile.id}
          x={tile.x}
          y={tile.y}
          z={tile.z}
          xSpacing={tile.xSpacing}
          ySpacing={tile.ySpacing}
          offsetX={tile.offsetX}
          offsetY={tile.offsetY}
          layerOffset={tile.layerOffset}
          isFree={tile.free}
          onClick={() => tile.free && onTileClick(tile)}
        >
          <img src={tile.imageUrl} alt="Card" />
        </TileElement>
      ))}
    </GameCanvas>
  )
}
