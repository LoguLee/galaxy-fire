
function ScoreBoard({ score, lives }) {
  return (
    <div className="game-stats">
      <span>SCORE: {score}</span>
      <span>LIVES: {'❤️ '.repeat(lives)}</span>
    </div>
  )
}

export default ScoreBoard
