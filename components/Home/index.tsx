'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { Tile, GameState } from '../../types/game'
import GameBoard from '../GameBoard'
import GameStats from '../GameStats'
import PowerUpsBar from '../PowerUpsBar'
import CollectedCards from '../CollectedCards'
import WalletStatus from '../WalletStatus'
import WalletConnect from '../WalletConnect'
import GameLeaderboard from '../GameLeaderboard'
import ScoreShare from '../ScoreShare'
import { useContractScore } from '@/hooks/useContractScore'
import { useFrame } from '@/components/farcaster-provider'


// Game constants
const CARD_IMAGES = [
  "/images/jessepollak1.jpg",
  "/images/pepe2.png",
  "/images/toshi3.jpg",
  "/images/pudgypenguins4.png",
  "/images/popcat5.jpg",
  "/images/boop6.jpg",
  "/images/bonk7.png",
  "/images/chillguy8.png",
  "/images/brianarmstrong9.png",
  "/images/cypher10.jpg",
]

const BASE_TIME = 40
const FREE_TILE_VISIBILITY_THRESHOLD = 0.5

// Background music playlist
const BACKGROUND_PLAYLIST = [
  "/music/puzzle-game-bright-casual-video-game-music-249202.mp3",
  "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/zS0QCi0PfUjO/puzzle-game-bright-casual-video-game-music-249202-IXpAPoNLmHQvesMUnyIFRnJ9yDfOzl.mp3?yAAE",
]

// Level configurations
const LEVEL_CONFIG = [
  { layers: 2, width: 3, height: 3, baseTiles: 9, totalTiles: 18 },
  { layers: 3, width: 4, height: 4, baseTiles: 16, totalTiles: 30 },
  { layers: 4, width: 4, height: 4, baseTiles: 16, totalTiles: 36 },
  { layers: 5, width: 4, height: 4, baseTiles: 16, totalTiles: 48 },
  { layers: 6, width: 4, height: 4, baseTiles: 16, totalTiles: 66 },
  { layers: 7, width: 4, height: 4, baseTiles: 16, totalTiles: 84 },
  { layers: 8, width: 4, height: 4, baseTiles: 16, totalTiles: 108 },
  { layers: 9, width: 4, height: 4, baseTiles: 16, totalTiles: 135 },
  { layers: 10, width: 4, height: 4, baseTiles: 16, totalTiles: 165 },
  { layers: 11, width: 4, height: 4, baseTiles: 16, totalTiles: 198 },
]

// Additional styled components for game screens
const GameScreen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: hidden;
`

const VictoryScreen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const LoseScreen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const StatsBox = styled.div`
  background: #0b0c1a;
  padding: 20px;
  border: 4px solid #000;
  border-radius: 15px;
  box-shadow: 6px 6px 0 #000;
  text-align: center;
  margin-bottom: 20px;
  color: white;
  font-size: 20px;
  text-shadow: 2px 2px #0b0c1a;

  div {
    margin: 10px 0;
    font-weight: bold;
  }
`

const VictoryTitle = styled.div`
  font-family: "Venite Adoremus", "Bangers", cursive;
  font-size: 40px;
  color: #fff;
  text-shadow: 3px 3px 0 #000, 0 0 8px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`

const ComicBubble = styled.div`
  font-size: 20px;
  padding: 12px 20px;
  text-align: center;
  line-height: 1.25;
  max-width: 280px;
`

const Toast = styled.div<{ show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0052FF;
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 8px;
  border: 3px solid #000;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.4s;
  max-width: 260px;
  line-height: 1.2;
`

// Trio match animation keyframes
const TrioMatchAnimation = styled.div`
  @keyframes trio-match {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
      box-shadow: 6px 6px 0 #000;
    }
    20% {
      transform: scale(1.6) rotate(10deg);
      opacity: 1;
      box-shadow:
        6px 6px 0 #000,
        0 0 25px #0052FF;
    }
    40% {
      transform: scale(1.4) rotate(-10deg);
      opacity: 0.9;
      box-shadow:
        6px 6px 0 #000,
        0 0 15px #0052FF;
    }
    60% {
      transform: scale(1.2) rotate(5deg);
      opacity: 0.7;
      box-shadow:
        6px 6px 0 #000,
        0 0 10px #0052FF;
    }
    100% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
      box-shadow: none;
    }
  }
`

// Styled Components
const GameContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0b0c1a;
  font-family: "Venite Adoremus", Arial, sans-serif;
`

const GameWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100vh;
  max-height: 1000px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)),
    url("/images/basestackbkg.png")
      no-repeat center center / cover;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

  * {
    font-family: "Venite Adoremus", "Pixelify Sans", "Press Start 2P", system-ui, monospace !important;
  }
`

const Menu = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 10px;
  box-sizing: border-box;
`

const GameTitle = styled.h1`
  font-family: "Venite Adoremus", "Bangers", cursive;
  font-size: 48px;
  color: white;
  text-shadow: 5px 5px #0b0c1a, -2px -2px #000;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 12px 0;
`

const StartButton = styled.button`
  padding: 12px 24px;
  background: #0052FF;
  color: white;
  border: 5px solid #0b0c1a;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  text-shadow: 3px 3px #0b0c1a;
  box-shadow: 5px 5px 0 #000;
  transform: rotate(-2deg);
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;

  &:hover {
    background: #0066FF;
    transform: rotate(0deg);
    box-shadow: 7px 7px 0 #000, 0 0 15px rgba(0, 82, 255, 0.75);
  }
`

const Rules = styled.div`
  width: 85%;
  background: #0b0c1a;
  padding: 12px 14px;
  border: 4px solid #0052FF;
  border-radius: 12px;
  box-shadow: 0 0 12px #000;
  font-size: 14px;
  text-align: left;
  margin-top: 10px;

  h3 {
    margin: 0 0 8px 0;
    font-family: "Venite Adoremus", "Bangers", cursive;
    font-size: 20px;
    text-shadow: 2px 2px #000;
    color: #d0d4d8;
    letter-spacing: 1px;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
  }
`

export default function CryptoPuzzle() {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    collectedTiles: [],
    moves: 0,
    time: 0,
    level: 1,
    lives: 3,
    score: 0,
    timeFreezeUsed: false,
    timerFrozen: false,
    hintUsed: false,
    selectedTileId: null,
    isMuted: false,
    gameStarted: false,
    showVictory: false,
    showLoseScreen: false,
    loseMessage: '',
    showLoader: true,
    showGameOver: false,
    finalScore: 0,
    animatingTiles: [],
    showScoreSubmission: false,
    showLeaderboard: false,
    showScoreShare: false,
  })

  // Add contract score hook
  const { setScore, isSubmitting: isSubmittingScore, isSuccess: isScoreSubmitted } = useContractScore()
  const { context } = useFrame()

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const trioSoundRef = useRef<HTMLAudioElement | null>(null)
  const victorySoundRef = useRef<HTMLAudioElement | null>(null)
  const currentTrackIndexRef = useRef<number>(-1)
  const isSelectingRef = useRef<boolean>(false)

  // Audio functions
  const playAudio = useCallback((audioElement: HTMLAudioElement | null, volume: number) => {
    if (audioElement) {
      audioElement.volume = volume
      audioElement.play().catch((e) => console.log('Error playing audio:', e))
    }
  }, [])

  const pauseAudio = useCallback((audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      audioElement.pause()
    }
  }, [])

  const queueNextBackgroundTrack = useCallback((autoPlay = false) => {
    if (!BACKGROUND_PLAYLIST.length || !backgroundMusicRef.current) return
    
    currentTrackIndexRef.current = (currentTrackIndexRef.current + 1) % BACKGROUND_PLAYLIST.length
    const nextSrc = BACKGROUND_PLAYLIST[currentTrackIndexRef.current]
    
    if (backgroundMusicRef.current.src !== nextSrc) {
      backgroundMusicRef.current.src = nextSrc
    }
    backgroundMusicRef.current.load()
    
    if (autoPlay && !gameState.isMuted) {
      playAudio(backgroundMusicRef.current, 0.3)
    }
  }, [gameState.isMuted, playAudio])

  // Initialize game
  useEffect(() => {
    // Initialize audio elements
    if (typeof window !== 'undefined') {
      // Background music
      backgroundMusicRef.current = new Audio()
      backgroundMusicRef.current.removeAttribute('loop')
      
      // Auto-advance to next track when current ends
      backgroundMusicRef.current.addEventListener('ended', () => {
        if (!gameState.isMuted) {
          queueNextBackgroundTrack(true)
        }
      })
      
      // Trio sound
      trioSoundRef.current = new Audio()
      trioSoundRef.current.src = "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/TmD6CdLxUZyd/sound1-ypKOdJ7EZ6bOdykWT0QUtJbEeem9aX.mpeg?QwZS"
      
      // Victory sound
      victorySoundRef.current = new Audio()
      victorySoundRef.current.src = "https://lqy3lriiybxcejon.public.blob.vercel-storage.com/TmD6CdLxUZyd/winning-IBSP65T5Dl3HA4iWSGI8XV2LpUkYVA.mpeg?Btp6"
    }

    // Initialize Farcade SDK
    if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
      const sdk = (window as any).FarcadeSDK
      sdk.on('play_again', () => resetGame())
      sdk.on('toggle_mute', (data: { isMuted: boolean }) => {
        setGameState(prev => {
          // Handle audio muting/unmuting
          if (data.isMuted) {
            pauseAudio(backgroundMusicRef.current)
            if (trioSoundRef.current) trioSoundRef.current.volume = 0
            if (victorySoundRef.current) victorySoundRef.current.volume = 0
          } else {
            if (backgroundMusicRef.current) {
              if (!backgroundMusicRef.current.src) {
                queueNextBackgroundTrack(true)
              } else {
                playAudio(backgroundMusicRef.current, 0.3)
              }
            }
            if (trioSoundRef.current) trioSoundRef.current.volume = 0.5
            if (victorySoundRef.current) victorySoundRef.current.volume = 0.7
          }
          return { ...prev, isMuted: data.isMuted }
        })
      })
    }

    // Show loader initially
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showLoader: false }))
    }, 3000)
  }, [queueNextBackgroundTrack])

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      showVictory: false,
      showLoseScreen: false,
      level: 1,
      lives: 3,
      score: 0,
      selectedTileId: null,
      timerFrozen: false,
      hintUsed: false,
    }))
    
    generateBoard(1)
    startTimer()
    
    // Start background music
    if (!gameState.isMuted && backgroundMusicRef.current) {
      queueNextBackgroundTrack(true)
    }
    
    if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
      (window as any).FarcadeSDK.singlePlayer.actions.ready()
    }
  }, [gameState.isMuted, queueNextBackgroundTrack])

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Reset background music
    if (backgroundMusicRef.current) {
      pauseAudio(backgroundMusicRef.current)
      backgroundMusicRef.current.currentTime = 0
      queueNextBackgroundTrack(true)
    }
    
    setGameState(prev => ({
      ...prev,
      tiles: [],
      collectedTiles: [],
      moves: 0,
      time: 0,
      level: 1,
      lives: 3,
      score: 0,
      timeFreezeUsed: false,
      timerFrozen: false,
      hintUsed: false,
      gameStarted: false,
      showVictory: false,
      showLoseScreen: false,
      showGameOver: false,
      finalScore: 0,
      animatingTiles: [],
    }))
    
    if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
      (window as any).FarcadeSDK.singlePlayer.actions.ready()
    }
  }, [pauseAudio, queueNextBackgroundTrack])

  const generateBoard = useCallback((currentLevel: number) => {
    const config = getLevelConfig(currentLevel)
    const totalTiles = config.totalTiles
    const baseSize = config.width * config.height

    // Ensure totalTiles is multiple of 3
    if (config.totalTiles % 3 !== 0) {
      const adjustedTiles = Math.floor(config.totalTiles / 3) * 3
      config.totalTiles = adjustedTiles
    }

    const triosNeeded = config.totalTiles / 3
    const tileTrios: string[] = []

    // Generate exactly 3 copies of each image
    for (let i = 0; i < triosNeeded; i++) {
      const imageUrl = CARD_IMAGES[i % CARD_IMAGES.length]
      tileTrios.push(imageUrl, imageUrl, imageUrl)
    }

    shuffleArray(tileTrios)

    // Create tiles with positions
    const tiles: Tile[] = []
    const allPositions: { x: number; y: number; z: number }[] = []

    // Add base layer positions
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        allPositions.push({ x, y, z: 0 })
      }
    }

    // Add upper layer positions
    const basePositions = []
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        basePositions.push({ x, y })
      }
    }
    shuffleArray(basePositions)

    let posIndex = 0
    const remainingTiles = totalTiles - baseSize
    for (let i = 0; i < remainingTiles; i++) {
      const z = Math.floor(i / baseSize) + 1
      if (z >= config.layers) break
      const pos = basePositions[posIndex % basePositions.length]
      allPositions.push({ x: pos.x, y: pos.y, z: z })
      posIndex++
    }

    // Create tiles
    const fixedTileWidth = 55
    const fixedTileHeight = 70
    const layerOffset = 20
    const xSpacing = fixedTileWidth + 8
    const ySpacing = fixedTileHeight + 8

    // Calculate center offsets based on grid size
    const totalWidth = config.width * xSpacing
    const totalHeight = config.height * ySpacing
    const offsetX = (400 - totalWidth) / 2 // Center horizontally (GameCanvas is 400px wide on mobile)
    const offsetY = (300 - totalHeight) / 2 // Center vertically

    for (let tileIndex = 0; tileIndex < totalTiles; tileIndex++) {
      const position = allPositions[tileIndex]
      const tile: Tile = {
        id: tileIndex,
        imageUrl: tileTrios[tileIndex],
        x: position.x,
        y: position.y,
        z: position.z,
        free: true,
        xSpacing,
        ySpacing,
        offsetX: Math.max(20, offsetX),
        offsetY: Math.max(20, offsetY),
        layerOffset,
      }
      tiles.push(tile)
    }

    setGameState(prev => ({
      ...prev,
      tiles,
      collectedTiles: [],
      moves: 0,
      time: BASE_TIME + (currentLevel - 1) * 10,
    }))

    updateTileStatus(tiles)
  }, [])

  const getLevelConfig = useCallback((levelNumber: number) => {
    if (levelNumber <= LEVEL_CONFIG.length) {
      return { ...LEVEL_CONFIG[levelNumber - 1] }
    }

    const base = LEVEL_CONFIG[LEVEL_CONFIG.length - 1]
    const extra = levelNumber - LEVEL_CONFIG.length
    const layers = base.layers + Math.floor(extra / 1)
    const width = base.width
    const height = base.height
    const baseTiles = width * height
    const growthPerLevel = 24
    let totalTiles = 198 + growthPerLevel * (levelNumber - 10)

    if (totalTiles % 3 !== 0) {
      totalTiles = Math.round(totalTiles / 3) * 3
    }

    return { layers, width, height, baseTiles, totalTiles }
  }, [])

  const shuffleArray = useCallback((array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }, [])

  const updateTileStatus = useCallback((tiles: Tile[], collectedTiles?: Tile[]) => {
    const updatedTiles = tiles.map(tile => {
      const tW = 60
      const tH = 75
      const layerOffset = tile.layerOffset || 25
      const tileRect = {
        left: tile.x * tile.xSpacing + tile.offsetX,
        top: tile.y * tile.ySpacing + tile.offsetY + tile.z * layerOffset,
        right: tile.x * tile.xSpacing + tile.offsetX + tW,
        bottom: tile.y * tile.ySpacing + tile.offsetY + tile.z * layerOffset + tH,
      }
      const tileArea = tW * tH

      let coveredArea = 0
      const coveringTiles = tiles.filter(other => other !== tile && other.z > tile.z)

      coveringTiles.forEach(other => {
        const oW = 60
        const oH = 75
        const otherLayerOffset = other.layerOffset || 25
        const otherRect = {
          left: other.x * other.xSpacing + other.offsetX,
          top: other.y * other.ySpacing + other.offsetY + other.z * otherLayerOffset,
          right: other.x * other.xSpacing + other.offsetX + oW,
          bottom: other.y * other.ySpacing + other.offsetY + other.z * otherLayerOffset + oH,
        }

        const overlapX = Math.max(0, Math.min(tileRect.right, otherRect.right) - Math.max(tileRect.left, otherRect.left))
        const overlapY = Math.max(0, Math.min(tileRect.bottom, otherRect.bottom) - Math.max(tileRect.top, otherRect.top))

        if (overlapX > 0 && overlapY > 0) {
          coveredArea += overlapX * overlapY
        }
      })

      coveredArea = Math.min(coveredArea, tileArea)
      const visibleArea = tileArea - coveredArea
      const visibilityPercentage = Math.max(0, visibleArea / tileArea)
      
      return {
        ...tile,
        free: visibilityPercentage >= FREE_TILE_VISIBILITY_THRESHOLD
      }
    })

    setGameState(prev => {
      const newState = { ...prev, tiles: updatedTiles }
      // Use provided collectedTiles or current state
      const currentCollectedTiles = collectedTiles || prev.collectedTiles
      
      const freeTiles = updatedTiles.filter(t => t.free)
      const blockedTiles = updatedTiles.filter(t => !t.free)
      
      console.log('updateTileStatus - Total tiles:', updatedTiles.length)
      console.log('updateTileStatus - Free tiles:', freeTiles.length)
      console.log('updateTileStatus - Blocked tiles:', blockedTiles.length)
      console.log('updateTileStatus - Collected tiles:', currentCollectedTiles.length)
      
      // Check game state with current collected tiles
      if (currentCollectedTiles.length >= 5) {
        const canMakeTrio = freeTiles.some(t1 =>
          freeTiles.some(t2 => t1 !== t2 && t1.imageUrl === t2.imageUrl) ||
          currentCollectedTiles.some(t =>
            t.imageUrl === t1.imageUrl && currentCollectedTiles.filter(ct => ct.imageUrl === t.imageUrl).length >= 1
          )
        )

        if (!canMakeTrio && freeTiles.length > 0) {
          // Don't call loseLife here, just return the state
          // The loseLife will be handled by the calling function
        }
      }
      
      return newState
    })
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    const maxTime = BASE_TIME + (gameState.level - 1) * 10
    setGameState(prev => ({ ...prev, time: maxTime }))
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        // Prevent multiple calls if already showing lose screen
        if (prev.showLoseScreen || prev.showGameOver) {
          return prev
        }
        
        if (!prev.timerFrozen) {
          const newTime = prev.time - 1
          if (newTime <= 0) {
            // Handle lose life directly here (like original loseLife function)
            const newLives = prev.lives - 1
            
            // Clear timer
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
            
            if (newLives <= 0) {
              // Game over - call Farcade SDK
              if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
                (window as any).FarcadeSDK.singlePlayer.actions.gameOver({ score: prev.score })
              }
              
              // Pause background music on game over
              if (backgroundMusicRef.current) {
                pauseAudio(backgroundMusicRef.current)
                backgroundMusicRef.current.currentTime = 0
              }
              
              return { 
                ...prev, 
                lives: newLives,
                gameStarted: false,
                showLoseScreen: false,
                showGameOver: true,
                finalScore: prev.score,
              }
            } else {
              // Show lose screen with retry option
              console.log('Timer lose screen state:', {
                level: prev.level,
                prevLives: prev.lives,
                newLives: newLives,
                showLoseScreen: true,
                loseMessage: 'Time ran out!',
                gameStarted: false,
              })
              return {
                ...prev,
                lives: newLives,
                showLoseScreen: true,
                loseMessage: 'Time ran out!',
                gameStarted: false,
              }
            }
          }
          return { ...prev, time: newTime }
        }
        return prev
      })
    }, 1000)
  }, [gameState.level])

  const loseLife = useCallback((message: string) => {
    setGameState(prev => {
      const newLives = prev.lives - 1
      
      // Clear timer (like original)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (newLives <= 0) {
        // Game over - call Farcade SDK
        if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
          (window as any).FarcadeSDK.singlePlayer.actions.gameOver({ score: prev.score })
        }
        return { 
          ...prev, 
          lives: newLives,
          gameStarted: false,
          showLoseScreen: false,
        }
      } else {
        // Show lose screen with retry option
        return {
          ...prev,
          lives: newLives,
          showLoseScreen: true,
          loseMessage: message,
          gameStarted: false,
        }
      }
    })
  }, [])


  const selectTile = useCallback((tile: Tile) => {
    // Prevent rapid taps and double selection
    if (isSelectingRef.current || gameState.selectedTileId === tile.id) {
      return
    }

    // Verify that the tile is free and selectable
    if (!tile.free) return

    // Set selection flag to prevent rapid taps
    isSelectingRef.current = true

    // Atomic operation - do everything in one state update
    setGameState(prev => {
      // Check if tile still exists and is free (prevent race conditions)
      const currentTile = prev.tiles.find(t => t.id === tile.id)
      if (!currentTile || !currentTile.free) {
        isSelectingRef.current = false
        return prev
      }
      
      // Check if collected area is full and no trio can be made
      if (prev.collectedTiles.length >= 5) {
        // Check if adding this tile would create a trio
        const wouldCreateTrio = prev.collectedTiles.filter(t => t.imageUrl === tile.imageUrl).length >= 2
        if (!wouldCreateTrio) {
          isSelectingRef.current = false
          return prev
        }
      }

      const newTiles = prev.tiles.filter(t => t.id !== tile.id)
      const newCollectedTiles = [...prev.collectedTiles, tile]
      
      // Update tile status immediately (synchronously)
      const updatedTiles = newTiles.map(t => {
        const tW = 60
        const tH = 75
        const layerOffset = t.layerOffset || 25
        const tileRect = {
          left: t.x * t.xSpacing + t.offsetX,
          top: t.y * t.ySpacing + t.offsetY + t.z * layerOffset,
          right: t.x * t.xSpacing + t.offsetX + tW,
          bottom: t.y * t.ySpacing + t.offsetY + t.z * layerOffset + tH,
        }
        
        let isFree = true
        for (const otherTile of newTiles) {
          if (otherTile.id !== t.id && otherTile.z > t.z) {
            const otherLayerOffset = otherTile.layerOffset || 25
            const otherRect = {
              left: otherTile.x * otherTile.xSpacing + otherTile.offsetX,
              top: otherTile.y * otherTile.ySpacing + otherTile.offsetY + otherTile.z * otherLayerOffset,
              right: otherTile.x * otherTile.xSpacing + otherTile.offsetX + tW,
              bottom: otherTile.y * otherTile.ySpacing + otherTile.offsetY + otherTile.z * otherLayerOffset + tH,
            }
            
            if (tileRect.left < otherRect.right && tileRect.right > otherRect.left &&
                tileRect.top < otherRect.bottom && tileRect.bottom > otherRect.top) {
              isFree = false
              break
            }
          }
        }
        
        return { ...t, free: isFree }
      })
      
      const newState = {
        ...prev,
        tiles: updatedTiles,
        collectedTiles: newCollectedTiles,
        moves: prev.moves + 1,
        selectedTileId: tile.id,
      }
      
      // Check for trio immediately
      const imageCounts: { [key: string]: number } = {}
      newCollectedTiles.forEach(tile => {
        imageCounts[tile.imageUrl] = (imageCounts[tile.imageUrl] || 0) + 1
      })

      let hasTrio = false
      for (const [imageUrl, count] of Object.entries(imageCounts)) {
        if (count >= 3) {
          hasTrio = true
          break
        }
      }
      
      // If trio found, handle it immediately
      if (hasTrio) {
        const trioImageUrl = Object.keys(imageCounts).find(url => imageCounts[url] >= 3)
        if (trioImageUrl) {
          const trioToRemove = newCollectedTiles.filter(t => t.imageUrl === trioImageUrl).slice(0, 3)
          const remainingCollected = newCollectedTiles.filter(t => !trioToRemove.includes(t))
          
          // Add trio animation
          const animatingIds = trioToRemove.map(t => t.id)
          
          // Play trio sound
          if (!prev.isMuted && trioSoundRef.current) {
            playAudio(trioSoundRef.current, 0.5)
          }
          
          // Calculate score for trio
          const trioScore = 100 + (prev.level - 1) * 50
          
          // Schedule animation cleanup
          setTimeout(() => {
            setGameState(currentState => ({
              ...currentState,
              animatingTiles: [],
            }))
          }, 800)
          
          // Check for victory after trio removal
          if (updatedTiles.length === 0 && remainingCollected.length === 0) {
            const maxTime = BASE_TIME + (prev.level - 1) * 10
            const remainingTime = prev.time
            const finalVictoryScore = prev.score + trioScore + 1500 + remainingTime * 75 + (prev.level - 1) * 200
            
            if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
              (window as any).FarcadeSDK.singlePlayer.actions.hapticFeedback()
            }
            
            // Play victory sound
            if (!prev.isMuted && victorySoundRef.current) {
              playAudio(victorySoundRef.current, 0.7)
            }
            
            // Stop the timer when victory is achieved
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            
            return {
              ...newState,
              collectedTiles: remainingCollected,
              score: finalVictoryScore,
              showVictory: true,
              gameStarted: false,
              animatingTiles: animatingIds,
            }
          }
          
          return {
            ...newState,
            collectedTiles: remainingCollected,
            score: prev.score + trioScore,
            animatingTiles: animatingIds,
          }
        }
      }
      
      // Check for victory condition - all tiles cleared and no collected tiles
      if (updatedTiles.length === 0 && newCollectedTiles.length === 0) {
        const maxTime = BASE_TIME + (prev.level - 1) * 10
        const remainingTime = prev.time
        const victoryScore = prev.score + 1500 + remainingTime * 75 + (prev.level - 1) * 200
        
        if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
          (window as any).FarcadeSDK.singlePlayer.actions.hapticFeedback()
        }
        
        // Play victory sound
        if (!prev.isMuted && victorySoundRef.current) {
          playAudio(victorySoundRef.current, 0.7)
        }
        
        // Stop the timer when victory is achieved
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        
        return {
          ...newState,
          score: victoryScore,
          showVictory: true,
          gameStarted: false,
        }
      }
      
      // Check for loss if collected area is full
      if (newCollectedTiles.length >= 5) {
        // Check if any trio can be made with current collected tiles
        const imageCounts: { [key: string]: number } = {}
        newCollectedTiles.forEach(tile => {
          imageCounts[tile.imageUrl] = (imageCounts[tile.imageUrl] || 0) + 1
        })
        
        const hasTrioInCollected = Object.values(imageCounts).some(count => count >= 3)
        
        // Check if any trio can be made from board tiles
        let canMakeTrioFromBoard = false
        
        // Check if any board tile can form a trio with collected tiles
        for (const boardTile of updatedTiles) {
          const sameImageInCollected = newCollectedTiles.filter(t => t.imageUrl === boardTile.imageUrl).length
          if (sameImageInCollected >= 2) {
            canMakeTrioFromBoard = true
            break
          }
        }
        
        // Check if any two board tiles can form a trio with collected tiles
        if (!canMakeTrioFromBoard) {
          for (let i = 0; i < updatedTiles.length; i++) {
            for (let j = i + 1; j < updatedTiles.length; j++) {
              if (updatedTiles[i].imageUrl === updatedTiles[j].imageUrl) {
                const sameImageInCollected = newCollectedTiles.filter(t => t.imageUrl === updatedTiles[i].imageUrl).length
                if (sameImageInCollected >= 1) {
                  canMakeTrioFromBoard = true
                  break
                }
              }
            }
            if (canMakeTrioFromBoard) break
          }
        }
        
        if (!hasTrioInCollected && !canMakeTrioFromBoard) {
          // No moves possible - lose a life and restart level
          const newLives = prev.lives - 1
          
          if (newLives <= 0) {
            // Game over - no lives left
            return {
              ...newState,
              gameStarted: false,
              showGameOver: true,
              finalScore: prev.score,
            }
          } else {
            // Lose a life and restart level
            return {
              ...newState,
              lives: newLives,
              gameStarted: false,
              showLoseScreen: true,
              loseMessage: 'No moves left!',
            }
          }
        }
      }
      
      // General check for no moves possible (even when collected area is not full)
      const freeTiles = updatedTiles.filter(t => t.free)
      if (freeTiles.length > 0) {
        let hasValidMove = false
        
        // Check if any free tile can be selected
        for (const freeTile of freeTiles) {
          // If collected area is not full, any free tile can be selected
          if (newCollectedTiles.length < 5) {
            hasValidMove = true
            break
          }
          
          // If collected area is full, check if this tile would create a trio
          const sameImageInCollected = newCollectedTiles.filter(t => t.imageUrl === freeTile.imageUrl).length
          if (sameImageInCollected >= 2) {
            hasValidMove = true
            break
          }
        }
        
        if (!hasValidMove) {
          // No moves possible - lose a life and restart level
          const newLives = prev.lives - 1
          
          if (newLives <= 0) {
            // Game over - no lives left
            return {
              ...newState,
              gameStarted: false,
              showGameOver: true,
              finalScore: prev.score,
            }
          } else {
            // Lose a life and restart level
            return {
              ...newState,
              lives: newLives,
              gameStarted: false,
              showLoseScreen: true,
              loseMessage: 'No moves left!',
            }
          }
        }
      }
      
      return newState
    })

    // Clear selection flag and selected tile ID after a short delay
    setTimeout(() => {
      isSelectingRef.current = false
      setGameState(prev => ({
        ...prev,
        selectedTileId: null
      }))
    }, 150)
  }, [gameState.selectedTileId])

  // Legacy checkTrio function - kept for compatibility but not used in main flow
  const checkTrio = useCallback(() => {
    setGameState(prev => {
      const imageCounts: { [key: string]: number } = {}
      prev.collectedTiles.forEach(tile => {
        imageCounts[tile.imageUrl] = (imageCounts[tile.imageUrl] || 0) + 1
      })

      for (const [imageUrl, count] of Object.entries(imageCounts)) {
        if (count >= 3) {
          const toRemove = prev.collectedTiles.filter(t => t.imageUrl === imageUrl).slice(0, 3)
          const remainingCollected = prev.collectedTiles.filter(t => !toRemove.includes(t))
          
          const newScore = prev.score + 50
          
          // Start animation for the trio tiles
          const animatingIds = toRemove.map(tile => tile.id)
          
          // Check victory
          const isVictory = prev.tiles.length === 0 && remainingCollected.length === 0
          
          if (isVictory) {
            const maxTime = BASE_TIME + (prev.level - 1) * 10
            const remainingTime = prev.time
            const victoryScore = newScore + 1500 + remainingTime * 75 + (prev.level - 1) * 200
            
            if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
              (window as any).FarcadeSDK.singlePlayer.actions.hapticFeedback()
            }
            
            // Play victory sound
            if (!prev.isMuted && victorySoundRef.current) {
              playAudio(victorySoundRef.current, 0.7)
            }
            
            // Stop the timer when victory is achieved
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            
            return {
              ...prev,
              collectedTiles: remainingCollected,
              score: victoryScore,
              showVictory: true,
              gameStarted: false,
              animatingTiles: animatingIds,
            }
          }
          
          // Remove tiles after animation completes
          setTimeout(() => {
            setGameState(currentState => {
              console.log('Removing trio tiles, remaining collected:', remainingCollected.length)
              console.log('Current tiles count:', currentState.tiles.length)
              
              const newState = {
                ...currentState,
                collectedTiles: remainingCollected,
                animatingTiles: [],
              }
              
              // Check if game is complete
              if (newState.tiles.length === 0 && remainingCollected.length === 0) {
                // Victory condition
                const maxTime = BASE_TIME + (newState.level - 1) * 10
                const remainingTime = newState.time
                const victoryScore = newState.score + 1500 + remainingTime * 75 + (newState.level - 1) * 200
                
                if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
                  (window as any).FarcadeSDK.singlePlayer.actions.hapticFeedback()
                }
                
                // Stop the timer when victory is achieved
                if (timerRef.current) {
                  clearInterval(timerRef.current)
                  timerRef.current = null
                }
                
                return {
                  ...newState,
                  score: victoryScore,
                  showVictory: true,
                  gameStarted: false,
                }
              }
              
              // Check if no more moves possible
              if (newState.tiles.length === 0 && remainingCollected.length > 0) {
                // No more moves possible
                const newLives = newState.lives - 1
                
                if (newLives <= 0) {
                  // Game over
                  if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
                    (window as any).FarcadeSDK.singlePlayer.actions.gameOver({ score: newState.score })
                  }
                  return {
                    ...newState,
                    lives: newLives,
                    gameStarted: false,
                    showLoseScreen: false,
                    showGameOver: true,
                    finalScore: newState.score,
                  }
                } else {
                  // Show lose screen
                  return {
                    ...newState,
                    lives: newLives,
                    showLoseScreen: true,
                    loseMessage: 'No more moves possible!',
                    gameStarted: false,
                  }
                }
              }
              
              // Update tile status only if there are tiles on the board
              if (newState.tiles.length > 0) {
                setTimeout(() => {
                  console.log('Updating tile status with tiles:', newState.tiles.length)
                  updateTileStatus(newState.tiles, remainingCollected)
                }, 50)
              }
              
              return newState
            })
          }, 800) // Match animation duration
          
          // Play trio sound
          if (!prev.isMuted && trioSoundRef.current) {
            playAudio(trioSoundRef.current, 0.5)
          }
          
          return {
            ...prev,
            animatingTiles: animatingIds,
            score: newScore,
          }
        }
      }
      
      return prev
    })
  }, [])

  const checkCollectedForLoss = useCallback(() => {
    setGameState(prev => {
      // Prevent multiple calls if already showing lose screen
      if (prev.showLoseScreen || prev.showGameOver) {
        return prev
      }
      
      const imageCounts: { [key: string]: number } = {}
      prev.collectedTiles.forEach(tile => {
        imageCounts[tile.imageUrl] = (imageCounts[tile.imageUrl] || 0) + 1
      })
      
      const canMakeTrio = Object.values(imageCounts).some(count => count >= 3)
      if (prev.collectedTiles.length === 5 && !canMakeTrio) {
        // Handle lose life directly here (like original loseLife function)
        const newLives = prev.lives - 1
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        
        if (newLives <= 0) {
          // Game over - call Farcade SDK
          if (typeof window !== 'undefined' && (window as any).FarcadeSDK) {
            (window as any).FarcadeSDK.singlePlayer.actions.gameOver({ score: prev.score })
          }
          
          // Pause background music on game over
          if (backgroundMusicRef.current) {
            pauseAudio(backgroundMusicRef.current)
            backgroundMusicRef.current.currentTime = 0
          }
          
          return { 
            ...prev, 
            lives: newLives,
            gameStarted: false,
            showLoseScreen: false,
            showGameOver: true,
            finalScore: prev.score,
          }
        } else {
          // Show lose screen with retry option
          console.log('Setting lose screen state:', {
            level: prev.level,
            prevLives: prev.lives,
            newLives: newLives,
            showLoseScreen: true,
            loseMessage: 'No more moves possible!',
            gameStarted: false,
          })
          return {
            ...prev,
            lives: newLives,
            showLoseScreen: true,
            loseMessage: 'No more moves possible!',
            gameStarted: false,
          }
        }
      }
      
      return prev
    })
  }, [])

  const freezeTime = useCallback(() => {
    if (gameState.timeFreezeUsed || gameState.timerFrozen) return
    
    setGameState(prev => ({
      ...prev,
      timeFreezeUsed: true,
      timerFrozen: true,
    }))
    
    showToast('Time frozen!')
  }, [gameState.timeFreezeUsed, gameState.timerFrozen])

  const showHint = useCallback(() => {
    if (gameState.hintUsed) return
    
    setGameState(prev => {
      if (prev.tiles.length === 0) {
        showToast('No tiles')
        return prev
      }
      
      const stats: { [key: string]: { board: Tile[]; collected: number } } = {}
      prev.tiles.forEach(t => {
        if (!stats[t.imageUrl]) stats[t.imageUrl] = { board: [], collected: 0 }
        stats[t.imageUrl].board.push(t)
      })
      prev.collectedTiles.forEach(t => {
        if (!stats[t.imageUrl]) stats[t.imageUrl] = { board: [], collected: 0 }
        stats[t.imageUrl].collected++
      })
      
      const candidates = Object.entries(stats)
        .filter(([_, info]) => info.board.length + info.collected >= 3)
        .map(([url, info]) => ({
          url,
          board: info.board,
          boardCount: info.board.length,
          collectedCount: info.collected,
        }))
      
      if (!candidates.length) {
        showToast('No trio available')
        return prev
      }
      
      candidates.sort((a, b) => {
        if (a.collectedCount !== b.collectedCount) return b.collectedCount - a.collectedCount
        return b.boardCount - a.boardCount
      })
      
      const chosen = candidates[0]
      const need = Math.min(3 - chosen.collectedCount, chosen.boardCount)
      
      if (need <= 0) {
        showToast('No executable trio')
        return prev
      }
      
      const toTake = chosen.board.sort((a, b) => b.z - a.z).slice(0, need)
      const newTiles = prev.tiles.filter(t => !toTake.includes(t))
      const newCollectedTiles = [...prev.collectedTiles, ...toTake]
      
      // Update tile status after removing tiles
      setTimeout(() => {
        updateTileStatus(newTiles, newCollectedTiles)
      }, 0)
      
      const newState = {
        ...prev,
        tiles: newTiles,
        collectedTiles: newCollectedTiles,
        hintUsed: true,
      }
      
      // Check for trio after adding tiles
      setTimeout(() => {
        checkTrio()
      }, 0)
      
      // Check for loss if collected area is full
      if (newCollectedTiles.length >= 5) {
        setTimeout(() => {
          checkCollectedForLoss()
        }, 0)
      }
      
      return newState
    })
    
    showToast('Trio removed')
  }, [gameState.hintUsed, updateTileStatus])

  const showToast = useCallback((message: string) => {
    // Toast functionality would be implemented here
    console.log('Toast:', message)
  }, [])


  const handleShowLeaderboard = useCallback(() => {
    console.log("🔍 Opening leaderboard")
    setGameState(prev => {
      console.log("🔍 Current showLeaderboard state:", prev.showLeaderboard)
      return { ...prev, showLeaderboard: true }
    })
  }, [])

  const handleCloseLeaderboard = useCallback(() => {
    setGameState(prev => ({ ...prev, showLeaderboard: false }))
  }, [])

  const handleShowScoreShare = useCallback(() => {
    setGameState(prev => ({ ...prev, showScoreShare: true }))
  }, [])

  const handleCloseScoreShare = useCallback(() => {
    setGameState(prev => ({ ...prev, showScoreShare: false }))
  }, [])

  const handleSubmitScore = useCallback(() => {
    // Use final score if game is over, otherwise use current score
    const scoreToSubmit = gameState.showGameOver ? gameState.finalScore : gameState.score
    console.log("🔍 Submitting score:", scoreToSubmit)
    console.log("🔍 Farcaster context:", context?.user)
    
    // Get Farcaster user data from context
    const farcasterUsername = context?.user?.username || "Anonymous"
    const farcasterFid = context?.user?.fid || 0
    const farcasterPfp = context?.user?.pfpUrl || ""
    
    console.log("🔍 Farcaster data - Username:", farcasterUsername, "FID:", farcasterFid, "PFP:", farcasterPfp)
    
    // Call setScore with user data - it will try addScore first, then setScore if needed
    setScore(scoreToSubmit, farcasterUsername, farcasterFid, farcasterPfp)
  }, [gameState.score, gameState.finalScore, gameState.showGameOver, context, setScore])

  const nextLevel = useCallback(() => {
    setGameState(prev => {
      const newLevel = prev.level + 1
      
      // Generate board and start timer after state update
      setTimeout(() => {
        generateBoard(newLevel)
        startTimer()
      }, 0)
      
      return {
        ...prev,
        level: newLevel,
        showVictory: false,
        gameStarted: true,
        timerFrozen: false,
      }
    })
  }, [generateBoard, startTimer])

  const retryLevel = useCallback(() => {
    setGameState(prev => {
      console.log('Retrying level:', prev.level)
      
      // Generate board and start timer after state update
      setTimeout(() => {
        generateBoard(prev.level)
        startTimer()
      }, 0)
      
      return {
        ...prev,
        showLoseScreen: false,
        gameStarted: true,
        timerFrozen: false,
      }
    })
  }, [generateBoard, startTimer])

  if (gameState.showLoader) {
    return (
      <GameContainer>
        <GameWrapper>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'linear-gradient(135deg, #0052FF 0%, #0029A3 50%, #001861 100%)', 
            zIndex: 9999 
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px', 
              width: '100%' 
            }}>
              <div style={{ 
                fontFamily: '"Venite Adoremus", "Pixelify Sans", "Press Start 2P", system-ui, monospace', 
                fontWeight: 700, 
                color: '#ffffff', 
                textShadow: '3px 3px 0 #000', 
                fontSize: '24px', 
                letterSpacing: '3px' 
              }}>
                BASE STACK
              </div>
            </div>
          </div>
        </GameWrapper>
      </GameContainer>
    )
  }

  if (!gameState.gameStarted && !gameState.showLoseScreen && !gameState.showVictory && !gameState.showGameOver) {
    return (
      <GameContainer>
        <GameWrapper>
          <Menu>
            <GameTitle>
              <span>Base</span>
              <span>Stack</span>
            </GameTitle>
            <StartButton onClick={startGame}>START</StartButton>
            <StartButton onClick={handleShowLeaderboard} style={{ background: '#8b5cf6', fontSize: '18px', padding: '10px 20px' }}>
              Leaderboard
            </StartButton>
            <WalletConnect />
            <Rules>
            <h3>How to Play:</h3>
               <p>🎯 Match 3 same cards to clear them</p>
               <p>📱 Tap cards on top (not blocked)</p>
               <p>⏰ Beat the timer before you run out of moves</p>
               <p>❤️ You have 3 lives - lose them all = game over</p>
               <p>🕐 Clock = Freeze time once</p>
               <p>🔑 Key = Auto-match best trio once</p>
            </Rules>
          </Menu>
        </GameWrapper>
        
        {gameState.showLeaderboard && (
          <GameLeaderboard onClose={handleCloseLeaderboard} />
        )}
      </GameContainer>
    )
  }

  return (
    <GameContainer>
      <TrioMatchAnimation />
      <GameWrapper>
        {gameState.showVictory && (
          <VictoryScreen>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <VictoryTitle>Congratulations!</VictoryTitle>
              <StatsBox>
                <div>Score: <span>{gameState.score}</span></div>
                <div>Time: <span>{BASE_TIME + (gameState.level - 1) * 10 - gameState.time}</span>s</div>
                <div>Moves: <span>{gameState.moves}</span></div>
              </StatsBox>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
                <StartButton onClick={nextLevel}>Next Level</StartButton>
                <StartButton 
                  onClick={handleSubmitScore} 
                  disabled={isSubmittingScore || isScoreSubmitted}
                  style={{ 
                    background: isScoreSubmitted ? '#10b981' : isSubmittingScore ? '#6b7280' : '#0052FF' 
                  }}
                >
                  {isSubmittingScore ? 'Submitting...' : isScoreSubmitted ? 'Score Saved!' : 'Submit Score'}
                </StartButton>
                <StartButton onClick={handleShowLeaderboard} style={{ background: '#8b5cf6' }}>
                  View Leaderboard
                </StartButton>
                <StartButton onClick={handleShowScoreShare} style={{ background: '#f59e0b' }}>
                  Share Score
                </StartButton>
              </div>
            </div>
          </VictoryScreen>
        )}

        {gameState.showLoseScreen && (
          <LoseScreen>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ComicBubble>{gameState.loseMessage}</ComicBubble>
              <StartButton onClick={retryLevel}>Retry</StartButton>
            </div>
          </LoseScreen>
        )}

        {gameState.showGameOver && (
          <VictoryScreen>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <VictoryTitle>Game Over</VictoryTitle>
              <StatsBox>
                <div>Final Score: <span>{gameState.finalScore}</span></div>
                <div>Level Reached: <span>{gameState.level}</span></div>
              </StatsBox>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
                <StartButton onClick={resetGame}>Play Again</StartButton>
                <StartButton 
                  onClick={handleSubmitScore} 
                  disabled={isSubmittingScore || isScoreSubmitted}
                  style={{ 
                    background: isScoreSubmitted ? '#10b981' : isSubmittingScore ? '#6b7280' : '#0052FF' 
                  }}
                >
                  {isSubmittingScore ? 'Submitting...' : isScoreSubmitted ? 'Score Saved!' : 'Submit Score'}
                </StartButton>
                <StartButton onClick={handleShowLeaderboard} style={{ background: '#8b5cf6' }}>
                  View Leaderboard
                </StartButton>
                <StartButton onClick={handleShowScoreShare} style={{ background: '#f59e0b' }}>
                  Share Score
                </StartButton>
              </div>
            </div>
          </VictoryScreen>
        )}
        {gameState.gameStarted && (
          <GameScreen>
            <WalletStatus showAddress={true} />
            <div style={{ width: '100%', position: 'relative' }}>
              <GameStats 
                lives={gameState.lives}
                level={gameState.level}
                score={gameState.score}
                time={gameState.time}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
              <GameBoard 
                tiles={gameState.tiles}
                onTileClick={selectTile}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
              <PowerUpsBar
                timeFreezeUsed={gameState.timeFreezeUsed}
                hintUsed={gameState.hintUsed}
                onFreezeTime={freezeTime}
                onShowHint={showHint}
              />
              <CollectedCards 
                collectedTiles={gameState.collectedTiles} 
                animatingTiles={gameState.animatingTiles}
              />
            </div>
          </GameScreen>
        )}

        <Toast show={false} />
        
        {gameState.showScoreShare && (
          <ScoreShare
            score={gameState.showGameOver ? gameState.finalScore : gameState.score}
            level={gameState.level}
            time={BASE_TIME + (gameState.level - 1) * 10 - gameState.time}
            onClose={handleCloseScoreShare}
          />
        )}
      </GameWrapper>
      
      {gameState.showLeaderboard && (
        <GameLeaderboard onClose={handleCloseLeaderboard} />
      )}
    </GameContainer>
  )
}
