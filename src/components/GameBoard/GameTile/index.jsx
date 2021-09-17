import React from 'react'
import PropTypes from 'prop-types'

const GameTile = ({isHeader, question, answer, category, value, answered, ...rest}) => {

  const displayValue = isHeader ? category : !answered ? <><span className="dollar">$</span>{value}</> : ''
  const className = isHeader ? 'category' : 'score'

  return (
    <div className={className + ' blue'} {...rest}>
      {displayValue}
    </div>
  )
}

GameTile.propTypes = {

}

export default GameTile