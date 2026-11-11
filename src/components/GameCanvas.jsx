
import { useEffect, useRef } from 'react'

import {
  createGameState,
  drawPlayer,
  drawBullets,
  updateBullets,
  spawnEnemies,
  drawEnemies,
  updateEnemies
} from '../game/gameEngine'

function GameCanvas({ onStatsChange, onGameOver, paused, onPauseToggle }) {
  const canvasRef = useRef(null)
  const callbacksRef = useRef({ onStatsChange, onGameOver, onPauseToggle })
  const pausedRef = useRef(paused)

  callbacksRef.current = { onStatsChange, onGameOver, onPauseToggle }
  pausedRef.current = paused

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const game = createGameState()

    // Create background stars
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      speed: 0.5 + Math.random() * 2
    }))

    callbacksRef.current.onStatsChange?.({
      score: game.score,
      lives: game.lives
    })

    const keys = {}
    let animationId
    let lastShot = 0
    let previousScore = game.score
    let previousLives = game.lives
    let gameOverNotified = false

    function handleKeyDown(event) {
      if (event.code === 'KeyP' && !event.repeat && !game.gameOver) {
        callbacksRef.current.onPauseToggle?.()
        event.preventDefault()
        return
      }

      keys[event.code] = true

      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault()
      }
    }

    function handleKeyUp(event) {
      keys[event.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    function gameLoop(now) {
      // Clear screen
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Animate background stars
      ctx.fillStyle = 'white'

      stars.forEach((star) => {
        star.y += star.speed

        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Pause screen
      if (pausedRef.current) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.7)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'white'
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('PAUSED', canvas.width / 2, 220)

        ctx.font = '18px Arial'
        ctx.fillText('Press P or Resume to continue', canvas.width / 2, 260)

        animationId = requestAnimationFrame(gameLoop)
        return
      }

      const player = game.player

      if (!game.gameOver) {
        // Move spaceship
        if (keys['ArrowLeft'] || keys['KeyA']) {
          player.x -= player.speed
        }

        if (keys['ArrowRight'] || keys['KeyD']) {
          player.x += player.speed
        }

        // Keep spaceship inside canvas
        player.x = Math.max(
          0,
          Math.min(canvas.width - player.width, player.x)
        )

        // Shoot bullets
        if (keys['Space'] && now - lastShot > 300) {
          game.bullets.push({
            x: player.x + 17,
            y: player.y
          })

          lastShot = now
        }

        game.bullets = updateBullets(game.bullets)

        // Create and move enemies
        spawnEnemies(game, now, canvas.width)
        updateEnemies(game, canvas.height)

        // Update React scoreboard when values change
        if (
          game.score !== previousScore ||
          game.lives !== previousLives
        ) {
          previousScore = game.score
          previousLives = game.lives

          callbacksRef.current.onStatsChange?.({
            score: game.score,
            lives: game.lives
          })
        }
      }

      // Draw everything
      drawPlayer(ctx, player)
      drawBullets(ctx, game.bullets)
      drawEnemies(ctx, game.enemies)

      if (game.gameOver) {
        ctx.fillStyle = 'white'
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, 220)

        if (!gameOverNotified) {
          gameOverNotified = true
          callbacksRef.current.onGameOver?.()
        }

        return
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={450}
      style={{
        width: '100%',
        maxWidth: '700px',
        background: '#020617',
        border: '2px solid #38bdf8',
        borderRadius: '12px'
      }}
    />
  )
}

export default GameCanvas
