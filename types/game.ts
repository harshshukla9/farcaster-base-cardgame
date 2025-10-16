export interface Tile {
  id: number
  imageUrl: string
  x: number
  y: number
  z: number
  free: boolean
  xSpacing: number
  ySpacing: number
  offsetX: number
  offsetY: number
  layerOffset: number
}

export interface GameState {
  tiles: Tile[]
  collectedTiles: Tile[]
  moves: number
  time: number
  level: number
  lives: number
  score: number
  timeFreezeUsed: boolean
  timerFrozen: boolean
  hintUsed: boolean
  selectedTileId: number | null
  isMuted: boolean
  gameStarted: boolean
  showVictory: boolean
  showLoseScreen: boolean
  loseMessage: string
  showLoader: boolean
  showGameOver: boolean
  finalScore: number
  animatingTiles: number[]
  showScoreSubmission: boolean
  showLeaderboard: boolean
  showScoreShare: boolean
}
