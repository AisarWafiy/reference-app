import React, { forwardRef, useImperativeHandle } from 'react'
import './styleTooltip.css'

export default forwardRef((props, ref) => {
  const data = props.value

  useImperativeHandle(ref, () => {
    return {
      getReactContainerClasses() {
        return ['custom-tooltip']
      },
      // isPopup() {
      //   return true
      // },
    }
  })

  return (
    <div className='custom-tooltip' style={{ zIndex: '999', position: 'relative' }}>
      <p>
        <span>{data}</span>
      </p>
    </div>
  )
})
