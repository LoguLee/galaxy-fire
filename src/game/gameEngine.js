
export function createGameState() {
  return {
    player: {
      x: 330,
      y: 390,
      width: 40,
      height: 40,
      speed: 5
    },
    bullets: [],
    enemies: [],
    score: 0,
    lives: 3,
    gameOver: false,
    lastEnemySpawn: 0
  }
}

// Draw spaceship
export function drawPlayer(ctx, player) {
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.moveTo(player.x + 20, player.y)
  ctx.lineTo(player.x, player.y + 40)
  ctx.lineTo(player.x + 40, player.y + 40)
  ctx.closePath()
  ctx.fill()
}

// Draw bullets
export function drawBullets(ctx, bullets) {
  ctx.fillStyle = '#facc15'

  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, 5, 12)
  })
}

// Move bullets upwards
export function updateBullets(bullets) {
  bullets.forEach((bullet) => {
    bullet.y -= 7
  })

  return bullets.filter((bullet) => bullet.y > 0)
}

// Create enemies at the top
export function spawnEnemies(game, now, canvasWidth) {
  if (now - game.lastEnemySpawn > 1000) {

    // Increase difficulty as the score increases
    const difficulty = Math.min(game.score / 100, 4)

    game.enemies.push({
      x: Math.random() * (canvasWidth - 30),
      y: 0,
      width: 30,
      height: 25,
      speed: 2 + Math.random() * 1.5 + difficulty * 0.5
    })

    game.lastEnemySpawn = now
  }
}

// Draw enemies
export function drawEnemies(ctx, enemies) {
  enemies.forEach((enemy) => {
    ctx.fillStyle = '#a3e635'
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

    // Enemy eyes
    ctx.fillStyle = '#020617'
    ctx.fillRect(enemy.x + 6, enemy.y + 7, 5, 5)
    ctx.fillRect(enemy.x + 19, enemy.y + 7, 5, 5)
  })
}

// Check whether two objects overlap
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

// Update enemies and check collisions
export function updateEnemies(game, canvasHeight) {
  for (let i = game.enemies.length - 1; i >= 0; i--) {
    const enemy = game.enemies[i]

    enemy.y += enemy.speed

    // Enemy reaches the bottom
    if (enemy.y > canvasHeight) {
      game.enemies.splice(i, 1)
      game.lives--
      continue
    }

    // Enemy hits spaceship
    if (isColliding(enemy, game.player)) {
      game.enemies.splice(i, 1)
      game.lives--
      continue
    }

    // Bullet hits enemy
    for (let j = game.bullets.length - 1; j >= 0; j--) {
      const bullet = game.bullets[j]

      const bulletBox = {
        x: bullet.x,
        y: bullet.y,
        width: 5,
        height: 12
      }

      if (isColliding(bulletBox, enemy)) {
        game.bullets.splice(j, 1)
        game.enemies.splice(i, 1)
        game.score += 10
        break
      }
    }
  }

  if (game.lives <= 0) {
    game.lives = 0
    game.gameOver = true
  }
}
