import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const YesNoSelectEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
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

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <select
        ref={refInput}
        value={value}
        style={{ width: '100%', outline: 'none', borderStyle: 'none' }}
        onChange={event => setValue(event.target.value)}
      >
        <option value='true'>Yes</option>
        <option value='false'>No</option>
      </select>
    </div>
  )
})

export default YesNoSelectEditor
