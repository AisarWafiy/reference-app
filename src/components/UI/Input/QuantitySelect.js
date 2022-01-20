import React from 'react'

const QuantitySelect = props => {
  return (
    <select
      // placeholder={labels.TEXT_ROLENAME}
      onChange={props.onChange}
      value={props.value}
      className='custom-select'
    >
      {props.options.map(opt => (
        <option value={opt} key={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

export default QuantitySelect
