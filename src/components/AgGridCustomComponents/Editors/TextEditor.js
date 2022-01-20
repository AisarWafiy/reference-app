import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as regex from 'constants/regex'

const TextEditor = forwardRef((props, ref, maxLength = 25) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus())
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value
      },

      isCancelBeforeStart() {
        return false
      },
    }
  })

  const handleChange = event => {
    // const maxLength = 4
    setValue(event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength))
  }

  return (
    <input
      type='text'
      ref={refInput}
      value={value}
      onChange={handleChange}
      className='form-control'
      style={{ width: '100%', border: 'none' }}
    />
  )
})

export default TextEditor
