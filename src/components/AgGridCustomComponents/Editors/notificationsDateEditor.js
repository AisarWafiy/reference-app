import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { calcDate } from 'constants/dateTime'
import DatePicker from 'react-datepicker'

const DateEditor = forwardRef((props, ref) => {
  const valueArr = props.value.split(' ')
  const dateArr = valueArr[1].split('-')
  const timeArr = valueArr[2].split(':')

  const refInput = useRef(null)
  const [value, setValue] = useState(props.value)

  const [timeHour, setTimeHour] = useState(Number(timeArr[0]))
  const [timeMin, setTimeMin] = useState(Number(timeArr[1]))

  const [dateObj, setDateObj] = useState(
    new Date(Number(dateArr[0]), Number(dateArr[1] - 1), Number(dateArr[2]), 0, 0),
  )

  useEffect(() => {
    const tempDate = new Date(dateObj)

    const year = tempDate.getFullYear()
    const month = tempDate.getMonth() + 1
    const date = tempDate.getDate()

    setValue(
      valueArr[0] +
        ' ' +
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date) +
        ' ' +
        (timeHour < 10 ? '0' + timeHour : timeHour) +
        ':' +
        (timeMin < 10 ? '0' + timeMin : timeMin),
    )
  }, [dateObj, timeHour, timeMin])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        const tempDate = new Date(dateObj)

        const year = tempDate.getFullYear()
        const month = tempDate.getMonth() + 1
        const date = tempDate.getDate()

        setValue(
          valueArr[0] +
            ' ' +
            year +
            '-' +
            (month < 10 ? '0' + month : month) +
            '-' +
            (date < 10 ? '0' + date : date) +
            ' ' +
            (timeHour < 10 ? '0' + timeHour : timeHour) +
            ':' +
            (timeMin < 10 ? '0' + timeMin : timeMin),
        )

        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },
      isPopup() {
        return true
      },

      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    }
  })

  const onChangeDate = date => {
    // console.log(date)
    setDateObj(new Date(date))
  }
  return (
    <DatePicker
      value={value}
      ref={refInput}
      className='form-control'
      selected={dateObj}
      onChange={onChangeDate}
      style={{ zIndex: '999', position: 'relative' }}
      minDate={calcDate()}
      disabledKeyboardNavigation
    >
      <div className='row mt-4'>
        <div className='row pl-4 pr-4 mt-3'>
          <div className='col-12 h6'>Time</div>
        </div>
        <div className='row pl-4 pr-4'>
          <div className='col-5'>
            <input
              name='timeHour'
              type='number'
              max={23}
              min={0}
              onChange={e => setTimeHour(e.target.value.substring(0, 2))}
              value={timeHour}
              className='form-control'
              placeholder='HH'
            />
          </div>
          <div className='h1 col'>:</div>
          <div className='col-5'>
            <input
              name='timeMin'
              type='number'
              max={59}
              min={0}
              onChange={e => setTimeMin(e.target.value.substring(0, 2))}
              value={timeMin}
              className='form-control'
              placeholder='MM'
            />
          </div>
        </div>
      </div>
    </DatePicker>
  )
})

export default DateEditor
