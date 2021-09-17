import { useCallback, useState, useEffect } from 'react'
import { getInitQuestions, useLocalStorage } from './helpers'
import { GameBoard, Question, Controls, ScoreBoard } from './components'

import qs from './questions'

//const initQuestionMap = getInitQuestions(qs)
//const initUsers = ['Anne', 'Andrew']
const initQuestionMap = {}
const initUsers = []
const possibleOtherKeys = ['ControlLeft', 'ControlRight', 'ArrowLeft', 'ArrowRight','ArrowDown', 'ArrowUp', 'AltLeft', 'AltRight', 'ShiftLeft', 'ShiftRight', 'Enter']


function Content({questionMap, markAnswered, users, scores, clickerKeys, possibleOtherKeys, scorePenalty}) {

  const [selected, setSelected] = useState(null)

  const goBack = useCallback(() => {
    setSelected(null)
  }, [setSelected])

  if(selected) {
    return <Question question={selected} markAnswered={(q, u, c, dontReturn) => {
      markAnswered(q, u, c)
      if(!dontReturn) {
        setSelected(null)
      }
    }} goBack={goBack} users={users} clickerKeys={clickerKeys} possibleOtherKeys={possibleOtherKeys} scorePenalty={scorePenalty}/>
  }
  
  return (<GameBoard possibleOtherKeys={possibleOtherKeys} questionMap={questionMap} setQuestion={setSelected} scores={scores} />);
}

function Game() {

  const [questionMap, setQuestionMap] = useLocalStorage('questionMap', initQuestionMap)
  const [users, setUsers] = useLocalStorage('users', initUsers)
  const [scores, setScores] = useLocalStorage('userScores', {})
  const [scorePenalty, setScorePenalty] = useLocalStorage('scorePenalty', true)

  const [clickerKeys, setClickerKeys] = useLocalStorage('userClickerKeys', {})

  useEffect(() => {
    setScores(sc => {
      return users.reduce((acc, user) => {
        acc[user] = sc[user] || 0
        return acc
      }, {})
    })
    setClickerKeys(sc => {
      return users.reduce((acc, user) => {
        acc[user] = sc[user] || ''
        return acc
      }, {})
    })
  }, [users])

  const markAnswered = useCallback((question, user, correct) => {
    setQuestionMap(qm => ({
      ...qm,
      [question.category]: {
        ...qm[question.category],
        [question.value]: {
          ...question.value,
          answered: true
        }
      }
    }))
    if(user) {
      const modifier = scorePenalty && !correct ? -1 : 1
      setScores(sc => ({
        ...sc,
        [user]: sc[user] + (question.value*modifier)
      }))
    }
  }, [setQuestionMap, setScores, scorePenalty])

  const addUser = useCallback(() => {
    let newUser = window.prompt(`Enter player ${users.length+1} name:`)
    if(newUser) {
      setUsers(u => u.concat(newUser))
    }
  }, [setUsers, users])

  const clearUsers = useCallback(() => {
    setUsers([])
  }, [setUsers])

  const resetScores = useCallback(() => {
    setScores(users.reduce((acc, u) => {
      acc[u] = 0;
      return acc
    }, {}))
  }, [users, setScores])

  const setQuestions = useCallback((csvText) => {
    setQuestionMap(getInitQuestions(csvText))
  }, [setQuestionMap])

  const setClickerKey = useCallback((u, key) => {
    if(!u) {
      return
    }
    setClickerKeys(cks => ({
      ...cks,
      [u]: key || ''
    }))
  }, [setClickerKeys])

  const setUserScore = useCallback(user => {
    const newScore = window.prompt('Manually overwrite score for ' + user)
    setScores(sc => ({
      ...sc,
      [user]: newScore
    }))
  }, [setScores])



  return <>
  <div className="controls">
    <Controls possibleOtherKeys={possibleOtherKeys} setClickerKey={setClickerKey} users={users} addUser={addUser} clearUsers={users.length > 0 && clearUsers} resetScores={users.length > 0 && resetScores} setQuestions={setQuestions} clickerKeys={clickerKeys} setScorePenalty={setScorePenalty} scorePenalty={scorePenalty} />
  </div>
  <div className="game">
    <Content possibleOtherKeys={possibleOtherKeys} questionMap={questionMap} users={users} scores={scores} markAnswered={markAnswered} clickerKeys={clickerKeys} scorePenalty={scorePenalty} />
    <ScoreBoard users={users} scores={scores} setUserScore={setUserScore} />
  </div>
  </>
}

export default Game;
