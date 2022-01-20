import React from 'react'

const Checkbox = props => {
  const checkedHandler = event => {
    // let checked = event.target.checked
    let checked = props.value
    let colId = props.column.colId
    props.node.setDataValue(colId, checked)
  }

  return <input type='checkbox' onChange={checkedHandler} checked={props.value} />
}

export default Checkbox
