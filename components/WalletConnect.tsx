'use client'

import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { base } from 'wagmi/chains'
import styled from 'styled-components'

// Top nav wallet component - compact version for navigation bar
const TopNavWallet = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(11, 12, 26, 0.95);
  border: 2px solid #0052FF;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 82, 255, 0.3);
  backdrop-filter: blur(10px);
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
`

const WalletLabel = styled.div`
  color: #0052FF;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const WalletAddress = styled.div`
  color: white;
  font-size: 12px;
  font-weight: bold;
`

const NetworkLabel = styled.div`
  color: #0052FF;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ConnectButton = styled.button`
  background: #0052FF;
  color: white;
  border: 2px solid #0b0c1a;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  text-shadow: 1px 1px #0b0c1a;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.2s ease;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;

  &:hover {
    background: #0066FF;
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 #000, 0 0 8px rgba(0, 82, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 1px 1px 0 #000;
  }
`

const SettingsButton = styled.button`
  background: #666;
  color: white;
  border: 2px solid #0b0c1a;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.2s ease;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 #000;
  }
`

// Original full wallet container for main menu
const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(11, 12, 26, 0.9);
  border: 3px solid #0052FF;
  border-radius: 12px;
  box-shadow: 0 0 18px rgba(0, 82, 255, 0.3);
  backdrop-filter: blur(10px);
  max-width: 380px;
  margin: 12px auto;
`

const DisconnectButton = styled.button`
  background: #666;
  color: white;
  border: 3px solid #0b0c1a;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  text-shadow: 2px 2px #0b0c1a;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s ease;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;

  &:hover {
    background: #777;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }
`

const WalletInfo = styled.div`
  color: white;
  text-align: center;
  font-family: "Venite Adoremus", "Pixelify Sans", system-ui, monospace;
  
  .address {
    font-size: 14px;
    background: rgba(0, 82, 255, 0.2);
    padding: 8px 12px;
    border-radius: 8px;
    border: 2px solid #0052FF;
    margin: 8px 0;
    word-break: break-all;
  }
  
  .balance {
    font-size: 16px;
    font-weight: bold;
    color: #0052FF;
  }
`

const Title = styled.h3`
  color: #0052FF;
  font-family: "Venite Adoremus", "Bangers", cursive;
  font-size: 20px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px #000;
`

interface WalletConnectProps {
  onConnect?: () => void
  onDisconnect?: () => void
  isTopNav?: boolean
}

export default function WalletConnect({ onConnect, onDisconnect, isTopNav = false }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { open } = useAppKit()

  // Check if user is on the correct chain
  const isOnBaseChain = chain?.id === base.id

  const handleConnect = () => {
    open()
    onConnect?.()
  }

  const handleDisconnect = () => {
    disconnect()
    onDisconnect?.()
  }

  const handleSwitchChain = () => {
    switchChain({ chainId: base.id })
  }

  // Top navigation wallet component
  if (isTopNav) {
    if (isConnected && address) {
      return (
        <TopNavWallet>
          <WalletLabel>WALLET</WalletLabel>
          <WalletAddress>
            {`${address.slice(0, 4)}...${address.slice(-4)}`}
          </WalletAddress>
          <NetworkLabel>BASE</NetworkLabel>
          <SettingsButton onClick={handleDisconnect}>
            X
          </SettingsButton>
        </TopNavWallet>
      )
    }

    return (
      <TopNavWallet>
        <ConnectButton onClick={handleConnect}>
          Connect Wallet
        </ConnectButton>
      </TopNavWallet>
    )
  }

  // Original full wallet component for main menu
  if (isConnected && address) {
    return (
      <WalletContainer>
        <Title>Wallet Connected</Title>
        <WalletInfo>
          <div className="address">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
          <div className="balance">
            {isOnBaseChain ? 'Connected to Base' : `Connected to ${chain?.name || 'Unknown Network'}`}
          </div>
        </WalletInfo>
        
        {/* Chain Switch Warning */}
        {!isOnBaseChain && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.3))',
            border: '2px solid rgba(255, 193, 7, 0.6)',
            borderRadius: '16px',
            padding: '16px',
            margin: '10px 0',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Wrong Network</div>
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>
              Please switch to Base network to continue
            </div>
            <button
              onClick={handleSwitchChain}
              style={{
                background: 'linear-gradient(135deg, #0052FF, #0066FF)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              🔄 Switch to Base
            </button>
          </div>
        )}
        
        <DisconnectButton onClick={handleDisconnect}>
          Disconnect
        </DisconnectButton>
      </WalletContainer>
    )
  }

  return (
    <WalletContainer>
      <Title>Connect Wallet</Title>
      <p style={{ color: 'white', textAlign: 'center', margin: '0 0 15px 0', fontSize: '16px' }}>
        Connect wallet to play & earn rewards!
      </p>
      <ConnectButton onClick={handleConnect}>
        Connect Wallet
      </ConnectButton>
    </WalletContainer>
  )
}
