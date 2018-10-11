import React from 'react';

const NumberTag = props => {
  const { number, total } = props
  const style = props.style || {}
  return <h1 className="title" style={Object.assign(style, {'display': 'inline-block'})}> {number || 0}/{total || 0}</h1>
}

export default NumberTag
