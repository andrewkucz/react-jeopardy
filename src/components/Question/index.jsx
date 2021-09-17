import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

const Question = ({question, goBack, markAnswered, users, clickerKeys}) => {

  const [clickerQueue, setClickerQueue] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)


  const addToQueue = useCallback(
    (u) => {
      setClickerQueue(cq => {
        if(cq.includes(u)) {
          return cq
        } else {
          return [...cq, u]
        }
      })
    },
    [setClickerQueue],
  )
  const clearQueue = useCallback(
    () => {
      setClickerQueue([])
    },
    [setClickerQueue],
  )

  useEffect(() => {
    function onKeyDown(e) {
      const i = users.findIndex(u => clickerKeys[u] === e.key)
      if (i !== -1) {
        addToQueue(users[i])
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [users, clickerKeys])

  return (
    <div className="question blue">
      <button className="go-back" onClick={() => {
        goBack()
        clearQueue()
      }}>Back to Board</button>
      <div className="clicker-queue">
        <strong>Buzzer Order</strong>
          {clickerQueue.map((u, i) => {
            return <div key={u}>{i+1}. {u}</div>
          })}
      </div>
      <div style={{position: 'absolute', bottom: '1rem', left: '1rem'}}>
        <button onClick={() => markAnswered(question)}>No one got it</button>
      </div>
      <div className="header">
        <div className="score">${question.value}</div>
        <div>{question.category}</div>
      </div>
      <div className="text">
        {showAnswer ? question.answer : question.question}
      </div>
      <div style={{minHeight: 35}}>
      {!showAnswer && clickerQueue.length > 0 && <button onClick={() => setShowAnswer(true)}>Show Answer</button>}
      </div>
      {clickerQueue.length > 0 && <><p>
        Award question to:
      </p>
      <div>
        {users.filter(u => clickerQueue.includes(u)).map(u => <button className="player-button" key={u} onClick={() => {
          markAnswered(question, u)
          clearQueue()
        }}>{u}</button>)}
      </div>      
      </>}
    </div>
  )
}

Question.propTypes = {

}

export default Question