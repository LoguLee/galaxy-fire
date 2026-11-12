
import { describe, it, expect } from 'vitest'

import {
  createGameState,
  updateBullets,
  updateEnemies
} from './gameEngine.js'

describe('Galaxy Fire Game Engine', () => {

  it('creates the game with the correct initial values', () => {
    const game = createGameState()

    expect(game.score).toBe(0)
    expect(game.lives).toBe(3)
    expect(game.gameOver).toBe(false)
    expect(game.bullets).toHaveLength(0)
    expect(game.enemies).toHaveLength(0)
  })

  it('moves bullets upwards', () => {
    const bullets = [
      { x: 100, y: 20 },
      { x: 150, y: 5 }
    ]

    const updatedBullets = updateBullets(bullets)

    expect(updatedBullets).toHaveLength(1)
    expect(updatedBullets[0].y).toBe(13)
  })

  it('increases score when a bullet hits an enemy', () => {
    const game = createGameState()

    game.enemies = [
      { x: 100, y: 100, width: 30, height: 25, speed: 0 }
    ]

    game.bullets = [
      { x: 110, y: 100 }
    ]

    updateEnemies(game, 500)

    expect(game.score).toBe(10)
    expect(game.enemies).toHaveLength(0)
    expect(game.bullets).toHaveLength(0)
    expect(game.lives).toBe(3)
  })

  it('reduces lives when an enemy hits the player', () => {
    const game = createGameState()

    game.enemies = [
      {
        x: 330,
        y: 390,
        width: 30,
        height: 25,
        speed: 0
      }
    ]

    updateEnemies(game, 500)

    expect(game.lives).toBe(2)
    expect(game.enemies).toHaveLength(0)
  })

  it('ends the game when lives reach zero', () => {
    const game = createGameState()

    game.lives = 1

    game.enemies = [
      {
        x: 330,
        y: 390,
        width: 30,
        height: 25,
        speed: 0
      }
    ]

    updateEnemies(game, 500)

    expect(game.lives).toBe(0)
    expect(game.gameOver).toBe(true)
  })

})
