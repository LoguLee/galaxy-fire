
function GameOver({ score, onRestart }) {
  return (
    <div className="instructions">
      <h2>GAME OVER</h2>
      <p>Your final score: {score}</p>

      <button className="start-button" onClick={onRestart}>
        PLAY AGAIN
      </button>
    </div>
  )
}

export default GameOver
