import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as regex from 'constants/regex'

const NumberEditor = forwardRef((props, ref, maxLength = 4) => {
  const [value, setValue] = useState(parseInt(props.value))
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus())
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    }
  })

  const handleChange = event => {
    setValue(event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength))
  }

  return (
    <input
      className='form-control'
      type='text'
      ref={refInput}
      value={value}
      onChange={handleChange}
      style={{ width: '100%', border: 'none' }}
    />
  )
})

export default NumberEditor
