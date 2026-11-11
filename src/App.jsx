
import { useState } from 'react'
import './App.css'

import GameCanvas from './components/GameCanvas'
import ScoreBoard from './components/ScoreBoard'
import GameOver from './components/GameOver'

function App() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [paused, setPaused] = useState(false)

  function handleStatsChange(stats) {
    setScore(stats.score)
    setLives(stats.lives)
  }

  function restartGame() {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameKey((previous) => previous + 1)
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h2>🚀 SPACE SHOOTER</h2>
        <span>ARCADE GAME</span>
      </header>

      <main className="game-screen">
        <h1>SPACE SHOOTER</h1>

        <ScoreBoard score={score} lives={lives} />

<button
  className="start-button"
  onClick={() => setPaused((previous) => !previous)}
  disabled={gameOver}
>
  {paused ? 'RESUME' : 'PAUSE'}
</button>

<GameCanvas
  key={gameKey}
  onStatsChange={handleStatsChange}
  onGameOver={() => setGameOver(true)}
  paused={paused}
  onPauseToggle={() => setPaused((previous) => !previous)}
/>

        {gameOver ? (
          <GameOver score={score} onRestart={restartGame} />
        ) : (
          <div className="instructions">
            <p>⬅️ Left Arrow / A – Move Left</p>
            <p>➡️ Right Arrow / D – Move Right</p>
            <p>SPACEBAR – Shoot</p>
            <p>Destroy the green enemies!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
