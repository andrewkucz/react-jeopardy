import React from 'react'

const ScoreBoard = ({users, scores, setUserScore}) => {

  if(!users || !users.length) {
    return (<div className="scores empty">
    <div className="max-width">
      There are currently no players added
    </div>
  </div>)
  }

  return (<div style={{gridTemplateColumns: `repeat(${users.length}, 1fr)`, gridTemplateRows: `min-content`}} className="game-scores">
    {users.map(u => {
      return <div key={u} className="blue container">
        <div className="name">{u}</div>
        <div className="score center" onClick={() => setUserScore(u)}><span className="dollar">$</span>{scores[u]}</div>
      </div>
    })}
  </div>)
}

export default ScoreBoard