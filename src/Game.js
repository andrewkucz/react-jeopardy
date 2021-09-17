import { useCallback, useState, useEffect } from 'react'
import { getInitQuestions, useLocalStorage } from './helpers'
import { GameBoard, Question, Controls, ScoreBoard } from './components'

import qs from './questions'

//const initQuestionMap = getInitQuestions(qs)
//const initUsers = ['Anne', 'Andrew']
const initQuestionMap = {}
const initUsers = []
const possibleOtherKeys = ['ControlLeft', 'ControlRight', 'ArrowLeft', 'ArrowRight','ArrowDown', 'ArrowUp', 'AltLeft', 'AltRight', 'ShiftLeft', 'ShiftRight', 'Enter']


function Content({questionMap, markAnswered, users, scores, clickerKeys, possibleOtherKeys}) {

  const [selected, setSelected] = useState(null)

  const goBack = useCallback(() => {
    setSelected(null)
  }, [setSelected])

  if(selected) {
    return <Question question={selected} markAnswered={(q, u) => {
      markAnswered(q, u)
      setSelected(null)
    }} goBack={goBack} users={users} clickerKeys={clickerKeys} possibleOtherKeys={possibleOtherKeys}/>
  }
  
  return (<GameBoard questionMap={questionMap} setQuestion={setSelected} scores={scores} />);
}

function Game() {

  const [questionMap, setQuestionMap] = useLocalStorage('questionMap', initQuestionMap)
  const [users, setUsers] = useLocalStorage('users', initUsers)
  const [scores, setScores] = useLocalStorage('userScores', {})

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

  const markAnswered = useCallback((question, user) => {
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
      setScores(sc => ({
        ...sc,
        [user]: sc[user] + question.value
      }))
    }
  }, [setQuestionMap, setScores])

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



  return <>
  <div className="controls">
    <Controls possibleOtherKeys={possibleOtherKeys} setClickerKey={setClickerKey} users={users} addUser={addUser} clearUsers={users.length > 0 && clearUsers} resetScores={users.length > 0 && resetScores} setQuestions={setQuestions} clickerKeys={clickerKeys} />
  </div>
  <div className="game">
    <Content possibleOtherKeys={possibleOtherKeys} questionMap={questionMap} users={users} scores={scores} markAnswered={markAnswered} clickerKeys={clickerKeys} />
    <ScoreBoard users={users} scores={scores} />
  </div>
  </>
}

export default Game;
