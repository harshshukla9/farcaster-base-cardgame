'use client'

import { useAccount } from 'wagmi'
import { base } from 'wagmi/chains'
import styled from 'styled-components'

const StatusContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(11, 12, 26, 0.9);
  border: 2px solid #0052FF;
  border-radius: 10px;
  padding: 8px 12px;
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
`

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#00FF00' : '#FF0000'};
  box-shadow: 0 0 8px ${props => props.connected ? '#00FF00' : '#FF0000'};
`

const StatusText = styled.span`
  color: white;
  font-size: 12px;
  font-weight: bold;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const AddressText = styled.span`
  color: #0052FF;
  font-size: 11px;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

interface WalletStatusProps {
  showAddress?: boolean
}

export default function WalletStatus({ showAddress = false }: WalletStatusProps) {
  const { address, isConnected, chain } = useAccount()

  if (!isConnected) {
    return null
  }

  const isOnBaseChain = chain?.id === base.id

  return (
    <StatusContainer>
      <StatusDot connected={isConnected && isOnBaseChain} />
      <StatusText>
        {isOnBaseChain ? 'Base' : chain?.name || 'Wallet'}
      </StatusText>
      {showAddress && address && (
        <AddressText>
          {`${address.slice(0, 4)}...${address.slice(-4)}`}
        </AddressText>
      )}
    </StatusContainer>
  )
}
