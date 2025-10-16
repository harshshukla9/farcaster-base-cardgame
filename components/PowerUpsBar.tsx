'use client'

import styled from 'styled-components'

const PowerUpsContainer = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  z-index: 6;
  pointer-events: none;
`

const PowerButton = styled.div<{ disabled: boolean }>`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000;
  border-radius: 10px;
  background: ${props => props.disabled ? '#555' : '#0052FF'};
  color: #fff;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? '0 0 0 #000' : '4px 4px 0 #000'};
  transition: transform 0.2s, box-shadow 0.2s, background 0.25s, filter 0.3s;
  pointer-events: auto;
  filter: ${props => props.disabled ? 'grayscale(80%)' : 'none'};

  &:hover:not(.disabled) {
    transform: translateY(-4px) scale(1.08);
    box-shadow: 6px 6px 0 #000, 0 0 10px rgba(255, 255, 255, 0.18);
  }

  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
    filter: drop-shadow(2px 2px 0 #000);
    pointer-events: none;
  }
`

interface PowerUpsBarProps {
  timeFreezeUsed: boolean
  hintUsed: boolean
  onFreezeTime: () => void
  onShowHint: () => void
}

export default function PowerUpsBar({ 
  timeFreezeUsed, 
  hintUsed, 
  onFreezeTime, 
  onShowHint 
}: PowerUpsBarProps) {
  return (
    <PowerUpsContainer>
      <PowerButton 
        disabled={timeFreezeUsed}
        onClick={onFreezeTime}
        title={timeFreezeUsed ? "Used" : "Freeze time (one use)"}
      >
        <img
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/zS0QCi0PfUjO/Pixel%20Clock-Pd21FxDg7D1P8qyn2yDfDGlZiNN4Qv.png?dh2k"
          alt="Freeze"
        />
      </PowerButton>
      <PowerButton 
        disabled={hintUsed}
        onClick={onShowHint}
        title={hintUsed ? "Used" : "Key (remove optimal trio)"}
      >
        <img
          src="https://lqy3lriiybxcejon.public.blob.vercel-storage.com/zS0QCi0PfUjO/key-vOGnBfYwDjzhs50sbdRO3W5uujvIxO.png?9A8o"
          alt="Key"
        />
      </PowerButton>
    </PowerUpsContainer>
  )
}
